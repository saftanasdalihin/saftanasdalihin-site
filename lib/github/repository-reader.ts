import {
  fetchRawRepositoryFile,
  githubApi,
  GITHUB_OWNER,
  isValidRepositoryName,
  type GitHubCommit,
  type GitHubRepository,
  type GitHubTree,
} from "@/lib/github/client";
import {
  analyzeRepositorySnapshot,
  type ProjectAnalysis,
  type RepositorySnapshot,
} from "@/lib/projects/analyzer";
import {
  deleteProjectCache,
  PROJECT_INDEX_CACHE_KEY,
  REPOSITORY_LIST_CACHE_KEY,
  readProjectCache,
  repositorySnapshotCacheKey,
  writeProjectCache,
} from "@/lib/projects/cache";

const INDEX_TTL_SECONDS = 60 * 60 * 6;
const REPOSITORY_TTL_SECONDS = 60 * 60;
const MAX_PROJECTS_PER_INDEX = 8;
const MAX_TREE_ENTRIES = 25_000;
const MAX_FILES_PER_SNAPSHOT = 12;
const MAX_FILE_BYTES = 60_000;

export interface ProjectIndex {
  builtAt: string;
  source: "GitHub";
  projects: ProjectAnalysis[];
  omittedRepositories: number;
  disclaimer: string;
}

function apiRepoPath(name: string): string {
  if (!isValidRepositoryName(name)) throw new Error("Invalid repository name.");
  return "/repos/" + GITHUB_OWNER + "/" + encodeURIComponent(name);
}

export async function listOwnedRepositories(forceRefresh = false): Promise<GitHubRepository[]> {
  if (!forceRefresh) {
    const cached = await readProjectCache<GitHubRepository[]>(REPOSITORY_LIST_CACHE_KEY);
    if (cached) return cached;
  }

  const repositoryPath = process.env.GITHUB_TOKEN
    ? "/user/repos?affiliation=owner&visibility=all&sort=pushed&per_page=100"
    : "/users/" + GITHUB_OWNER + "/repos?type=owner&sort=pushed&per_page=100";
  const repositories = await githubApi<GitHubRepository[]>(repositoryPath);
  const owned = repositories.filter(
    (repository) =>
      repository.owner?.login?.toLowerCase() === GITHUB_OWNER &&
      !repository.private &&
      !repository.fork &&
      repository.name
  );
  await writeProjectCache(REPOSITORY_LIST_CACHE_KEY, owned, REPOSITORY_TTL_SECONDS);
  return owned;
}

function isRelevantPortfolioRepository(repository: GitHubRepository): boolean {
  if (repository.archived || repository.fork) return false;
  const name = repository.name.toLowerCase();
  if (
    name === "saftanasdalihin-site" ||
    name.startsWith("2025-02-gamma") ||
    name.startsWith("2025-03-curve") ||
    name.startsWith("phase-") ||
    name.includes("week1") ||
    name.includes("week2") ||
    name.includes("welcome-to-code") ||
    name.includes("taskflow") ||
    name.includes("ecommerce")
  ) return false;

  return (
    repository.language === "Solidity" ||
    /contract|dao|token|vault|fund|voting|vote|merkle|multisig|blockchain|web3|crowdfunding|lazorkit|sybil|amanah|rupiah|stake|treasury|qastha/i.test(
      name + " " + (repository.description ?? "")
    )
  );
}

function filePriority(path: string): number {
  const lower = path.toLowerCase();
  if (/^readme\.md$/i.test(path)) return 0;
  if (/^foundry\.toml$|^hardhat\.config\.[cm]?[jt]s$|^package\.json$|^remappings\.txt$/.test(lower)) return 1;
  if (/^\.github\/workflows\/.*\.ya?ml$/.test(lower)) return 2;
  if (/^(test|tests|__tests__)\//.test(lower) && /\.(sol|ts|tsx|js|mjs|cjs)$/.test(lower)) return 3;
  if (/^(src|contracts|script|scripts|lib)\//.test(lower) && /\.(sol|ts|tsx|js|mjs|cjs)$/.test(lower)) return 4;
  if (/\.sol$/.test(lower)) return 5;
  return 99;
}

function selectRelevantPaths(tree: GitHubTree): string[] {
  return tree.tree
    .filter((entry) => entry.type === "blob" && entry.size !== undefined && entry.size <= MAX_FILE_BYTES)
    .filter((entry) => filePriority(entry.path) < 99)
    .sort((a, b) => filePriority(a.path) - filePriority(b.path))
    .slice(0, MAX_FILES_PER_SNAPSHOT)
    .map((entry) => entry.path);
}

function githubFileUrl(repositoryName: string, commitSha: string, path: string): string {
  const safePath = path.split("/").map(encodeURIComponent).join("/");
  return "https://github.com/" + GITHUB_OWNER + "/" + repositoryName + "/blob/" + commitSha + "/" + safePath;
}

export async function readRepositorySnapshot(
  repositoryName: string,
  forceRefresh = false,
  knownCommit?: GitHubCommit
): Promise<RepositorySnapshot> {
  if (!isValidRepositoryName(repositoryName)) throw new Error("Invalid repository name.");

  const repositories = await listOwnedRepositories(forceRefresh);
  const repository = repositories.find((item) => item.name.toLowerCase() === repositoryName.toLowerCase());
  if (!repository) throw new Error("Repository not found in the owner's accessible repositories.");

  const commit = knownCommit ?? await githubApi<GitHubCommit>(
    apiRepoPath(repository.name) + "/commits/" + encodeURIComponent(repository.default_branch)
  );
  const branchTreeSha = commit.commit?.tree?.sha;
  if (!branchTreeSha) throw new Error("GitHub did not return a repository tree reference.");

  const tree = await githubApi<GitHubTree>(
    apiRepoPath(repository.name) + "/git/trees/" + branchTreeSha + "?recursive=1"
  );
  const allPaths = tree.tree
    .filter((entry) => entry.type === "blob")
    .map((entry) => entry.path)
    .slice(0, MAX_TREE_ENTRIES);
  const selectedPaths = selectRelevantPaths(tree);

  const files = await Promise.all(
    selectedPaths.map(async (path) => {
      const content = await fetchRawRepositoryFile(
        repository.name,
        commit.sha,
        path,
        MAX_FILE_BYTES
      );
      if (content === null) return null;
      return {
        path,
        content,
        url: githubFileUrl(repository.name, commit.sha, path),
      };
    })
  );

  return {
    repository,
    commitSha: commit.sha,
    treeSha: branchTreeSha,
    treePaths: allPaths,
    treeTruncated: tree.truncated,
    files: files.filter((file): file is NonNullable<typeof file> => file !== null),
  };
}

export async function getProjectAnalysis(
  repositoryName: string,
  forceRefresh = false
): Promise<ProjectAnalysis> {
  if (!isValidRepositoryName(repositoryName)) throw new Error("Invalid repository name.");
  const repositories = await listOwnedRepositories();
  const repository = repositories.find((item) => item.name.toLowerCase() === repositoryName.toLowerCase());
  if (!repository) throw new Error("Repository not found in the owner's accessible repositories.");
  if (repository.fork || repository.archived) {
    throw new Error("Archived repositories and forks are excluded from portfolio scoring.");
  }

  const commit = await githubApi<GitHubCommit>(
    apiRepoPath(repository.name) + "/commits/" + encodeURIComponent(repository.default_branch)
  );
  const cacheKey = repositorySnapshotCacheKey(repository.name, commit.sha);
  if (!forceRefresh) {
    const cached = await readProjectCache<ProjectAnalysis>(cacheKey);
    if (cached) return cached;
  }

  const snapshot = await readRepositorySnapshot(repository.name, false, commit);
  const analysis = analyzeRepositorySnapshot(snapshot);
  await writeProjectCache(cacheKey, analysis);
  return analysis;
}

export async function getProjectIndex(forceRefresh = false): Promise<ProjectIndex> {
  if (!forceRefresh) {
    const cached = await readProjectCache<ProjectIndex>(PROJECT_INDEX_CACHE_KEY);
    if (cached) return cached;
  }

  const repositories = await listOwnedRepositories(forceRefresh);
  const candidates = repositories
    .filter(isRelevantPortfolioRepository)
    .sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const priorityPattern = /minidao-treasury|ethicforge|sura-chain|classfund|multisig-wallet|erc-20/;
      const aPriority = priorityPattern.test(aName) ? 0 : 1;
      const bPriority = priorityPattern.test(bName) ? 0 : 1;
      return aPriority - bPriority || (b.pushed_at ?? "").localeCompare(a.pushed_at ?? "");
    });

  const analyses: ProjectAnalysis[] = [];
  const selected = candidates.slice(0, MAX_PROJECTS_PER_INDEX);
  // Keep concurrent GitHub requests bounded; one failed repo does not block others.
  for (let i = 0; i < selected.length; i += 3) {
    const group = selected.slice(i, i + 3);
    const results = await Promise.all(group.map(async (repository) => {
      try {
        return await getProjectAnalysis(repository.name, forceRefresh);
      } catch (error) {
        console.warn("Skipped repository during Safta AI indexing:", repository.name, error);
        return null;
      }
    }));
    analyses.push(...results.filter((item): item is ProjectAnalysis =>
      item !== null && item.classification === "portfolio-candidate"
    ));
  }

  analyses.sort((a, b) => b.totalScore - a.totalScore);
  const index: ProjectIndex = {
    builtAt: new Date().toISOString(),
    source: "GitHub",
    projects: analyses,
    omittedRepositories: Math.max(0, candidates.length - MAX_PROJECTS_PER_INDEX),
    disclaimer: "Ranking is a heuristic for portfolio triage, not a security audit or proof of quality. Repositories are read only; code and tests are not executed.",
  };
  await writeProjectCache(PROJECT_INDEX_CACHE_KEY, index, INDEX_TTL_SECONDS);
  return index;
}

export interface WorkflowRunEvidence {
  name: string;
  status: string;
  conclusion: string | null;
  url: string;
  headBranch: string;
  headSha: string;
  createdAt: string;
  updatedAt: string;
}

export async function getLatestWorkflowRuns(
  repositoryName: string,
  forceRefresh = false
): Promise<WorkflowRunEvidence[]> {
  if (!isValidRepositoryName(repositoryName)) throw new Error("Invalid repository name.");
  const repositories = await listOwnedRepositories();
  const repository = repositories.find((item) => item.name.toLowerCase() === repositoryName.toLowerCase());
  if (!repository || repository.private) return [];

  const cacheKey = "safta-ai:workflow-runs:v1:" + repository.name;
  if (!forceRefresh) {
    const cached = await readProjectCache<WorkflowRunEvidence[]>(cacheKey);
    if (cached) return cached;
  }

  try {
    const response = await githubApi<{
      workflow_runs?: Array<{
        name?: string;
        status?: string;
        conclusion?: string | null;
        html_url?: string;
        head_branch?: string;
        head_sha?: string;
        created_at?: string;
        updated_at?: string;
      }>;
    }>(
      apiRepoPath(repository.name) + "/actions/runs?branch=" +
      encodeURIComponent(repository.default_branch) + "&per_page=3"
    );

    const runs = (response.workflow_runs ?? []).slice(0, 3).map((run) => ({
      name: run.name ?? "GitHub Actions workflow",
      status: run.status ?? "unknown",
      conclusion: run.conclusion ?? null,
      url: run.html_url ?? repository.html_url + "/actions",
      headBranch: run.head_branch ?? repository.default_branch,
      headSha: run.head_sha ?? "",
      createdAt: run.created_at ?? "",
      updatedAt: run.updated_at ?? "",
    }));
    await writeProjectCache(cacheKey, runs, 300);
    return runs;
  } catch (error) {
    // Public repositories may have Actions disabled or the API may be rate limited.
    console.warn("Safta AI could not read workflow status:", repository.name, error);
    await writeProjectCache(cacheKey, [], 60);
    return [];
  }
}

export async function invalidateRepositoryCaches(): Promise<void> {
  // Cached analyses are keyed by commit SHA, so new commits naturally get a
  // fresh cache key. Rebuild the current index and repository metadata next read.
  await deleteProjectCache(PROJECT_INDEX_CACHE_KEY, REPOSITORY_LIST_CACHE_KEY);
}
