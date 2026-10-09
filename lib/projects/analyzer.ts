import type { GitHubRepository } from "../github/client";

export interface RepositoryFileEvidence {
  path: string;
  url: string;
  content: string;
}

export interface RepositorySnapshot {
  repository: GitHubRepository;
  commitSha: string;
  treeSha: string;
  treePaths: string[];
  treeTruncated?: boolean;
  files: RepositoryFileEvidence[];
}

export type RepositoryClassification =
  | "portfolio-candidate"
  | "security-contest-study"
  | "learning-or-course"
  | "fork"
  | "archived"
  | "portfolio-website";

export interface ScoreBreakdown {
  securityAndPermissions: number;
  architectureAndCorrectness: number;
  testing: number;
  meaningfulComplexity: number;
  documentation: number;
  maintainabilityAndCI: number;
}

export interface ProjectAnalysis {
  name: string;
  fullName: string;
  url: string;
  description: string;
  defaultBranch: string;
  commitSha: string;
  pushedAt: string | null;
  language: string | null;
  stars: number;
  classification: RepositoryClassification;
  totalScore: number;
  scoreBreakdown: ScoreBreakdown;
  summary: string;
  strengths: string[];
  limitations: string[];
  evidence: Array<{ label: string; path: string; url: string }>;
  testStatus: "found-not-executed" | "no-test-evidence";
  scoreDisclaimer: string;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function hasFile(paths: string[], pattern: RegExp): boolean {
  return paths.some((path) => pattern.test(path));
}

function countFiles(paths: string[], pattern: RegExp): number {
  return paths.filter((path) => pattern.test(path)).length;
}

export function classifyRepository(
  repository: Pick<GitHubRepository, "name" | "fork" | "archived">,
  readme = ""
): RepositoryClassification {
  const name = repository.name.toLowerCase();
  if (repository.archived) return "archived";
  if (repository.fork) return "fork";
  if (name === "saftanasdalihin-site") return "portfolio-website";
  if (/2025[-_](02[-_]gamma|03[-_]curve)|security[-_ ]contest/.test(name)) {
    return "security-contest-study";
  }
  if (
    /^phase[-_]/.test(name) ||
    /welcome-to-code|week[-_ ]\d/.test(name) ||
    /cyfrin updraft|course exercise|course repository/i.test(readme)
  ) {
    return "learning-or-course";
  }
  return "portfolio-candidate";
}

export function analyzeRepositorySnapshot(snapshot: RepositorySnapshot): ProjectAnalysis {
  const { repository, commitSha, treePaths, files } = snapshot;
  const readmeFile = files.find((file) => /^readme\.md$/i.test(file.path));
  const readme = readmeFile?.content ?? "";
  const isTestPath = (path: string) =>
    /(^|\/)(test|tests|__tests__)(\/|\.|$)|\.t\.sol$|\.test\.[cm]?[jt]sx?$|\.spec\.[cm]?[jt]sx?$/i.test(path);
  const testFiles = files.filter((file) => isTestPath(file.path));
  const sourceFiles = files.filter(
    (file) => !isTestPath(file.path) && /\.(sol|[cm]?[jt]sx?)$/i.test(file.path)
  );
  const sourceText = sourceFiles.map((file) => file.content).join("\n");
  const testText = testFiles.map((file) => file.content).join("\n");
  const contractCount = countFiles(treePaths, /\.sol$/i);
  const testCount = treePaths.filter(isTestPath).length;
  const interfaceCount = countFiles(treePaths, /(^|\/)(interfaces?|libraries?)\//i);
  const workflowCount = countFiles(treePaths, /^\.github\/workflows\/.*\.ya?ml$/i);
  const hasFoundry = hasFile(treePaths, /(^|\/)foundry\.toml$/i);
  const hasPackageLock = hasFile(treePaths, /(^|\/)(package-lock\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?)$/i);
  const hasCi = workflowCount > 0;
  const hasAssertions = /\b(expect|assertEq|assertTrue|assertFalse|toEqual|toBe|toThrow|should\.)\b/i.test(testText);
  const hasAccessControls = /\b(Ownable|AccessControl|onlyOwner|onlyRole|_checkRole|hasRole|AccessControlDefaultAdminRules)\b/i.test(sourceText);
  const hasInputValidation = /\b(require|revert)\s*\(/i.test(sourceText);
  const hasCustomErrors = /\berror\s+[A-Z][A-Za-z0-9_]*\s*\(/.test(sourceText);
  const hasEvents = /\bevent\s+[A-Z][A-Za-z0-9_]*\s*\(/.test(sourceText);
  const hasInterfaces = interfaceCount > 0 || /\binterface\s+[A-Z]/.test(sourceText);
  const hasReentrancyProtection = /reentrancyguard|nonreentrant|checks-effects-interactions/i.test(sourceText);
  const hasModules = contractCount > 2 || /factory|module|adapter|strategy|vault|governance/i.test(
    [repository.name, repository.description ?? "", readme, sourceText].join(" ")
  );
  const hasSetupInstructions = /install|installation|getting started|quick start|forge test|npm run|usage/i.test(readme);
  const hasArchitectureDocs = /architecture|design|how it works|contract overview|system design/i.test(readme);
  const hasQualityConfig = hasFile(
    treePaths,
    /(^|\/)(\.prettierrc.*|prettier\.config\..*|\.solhint.*|\.eslintrc.*|eslint\.config\..*)$/i
  );

  const scoreBreakdown: ScoreBreakdown = {
    securityAndPermissions: clamp(
      (hasAccessControls ? 50 : 10) +
      (hasInputValidation ? 15 : 0) +
      (hasCustomErrors ? 10 : 0) +
      (hasEvents ? 5 : 0) +
      (testCount > 0 && hasAssertions ? 10 : 0) +
      (hasReentrancyProtection ? 10 : 0)
    ),
    architectureAndCorrectness: clamp(
      20 +
      (hasInterfaces ? 20 : 0) +
      (hasModules ? 25 : 0) +
      (contractCount > 1 ? 15 : 0) +
      (/(error|edge case|invariant|validation|failure mode)/i.test(readme) ? 10 : 0) +
      (hasCustomErrors ? 10 : 0)
    ),
    testing: clamp(
      (testCount > 0 ? 45 : 0) +
      (hasAssertions ? 30 : 0) +
      (hasFoundry || hasFile(treePaths, /hardhat\.config\.[cm]?[jt]s$/i) ? 15 : 0) +
      (hasCi ? 10 : 0)
    ),
    meaningfulComplexity: clamp(
      10 +
      Math.min(35, contractCount * 5) +
      Math.min(20, interfaceCount * 5) +
      (hasModules ? 20 : 0) +
      (/governance|treasury|factory|oracle|token|vault|escrow|merkle|multisig/i.test(
        [repository.name, repository.description ?? "", readme].join(" ")
      ) ? 15 : 0)
    ),
    documentation: clamp(
      (readme.length > 1500 ? 35 : readme.length > 500 ? 20 : readme.length > 100 ? 10 : 0) +
      (hasSetupInstructions ? 25 : 0) +
      (hasArchitectureDocs ? 20 : 0) +
      (/(feature|test|security|limitation|license)/i.test(readme) ? 10 : 0) +
      (readmeFile ? 10 : 0)
    ),
    maintainabilityAndCI: clamp(
      (hasCi ? 35 : 0) +
      (hasPackageLock ? 20 : 0) +
      (hasQualityConfig ? 15 : 0) +
      (hasFoundry || hasFile(treePaths, /hardhat\.config\.[cm]?[jt]s$/i) ? 15 : 0) +
      (readme.length > 500 ? 15 : 0)
    ),
  };

  const totalScore = clamp(
    scoreBreakdown.securityAndPermissions * 0.25 +
    scoreBreakdown.architectureAndCorrectness * 0.20 +
    scoreBreakdown.testing * 0.20 +
    scoreBreakdown.meaningfulComplexity * 0.15 +
    scoreBreakdown.documentation * 0.10 +
    scoreBreakdown.maintainabilityAndCI * 0.10
  );

  const strengths: string[] = [];
  const limitations: string[] = [];
  if (testCount > 0) strengths.push(testCount + " test-related path(s) detected");
  if (hasAssertions) strengths.push("Assertion-like test or invariant patterns detected");
  if (hasAccessControls) strengths.push("Access-control patterns detected in non-test source files");
  if (hasInputValidation) strengths.push("Explicit require/revert validation patterns detected in non-test source files");
  if (hasInterfaces) strengths.push("Interfaces or library separation detected");
  if (hasCi) strengths.push(workflowCount + " GitHub Actions workflow file(s) detected");
  if (readme.length > 500) strengths.push("README contains more than a brief project description");
  if (snapshot.treeTruncated) limitations.push("GitHub reported a truncated repository tree; some paths may be missing");
  if (testCount === 0) limitations.push("No recognizable test paths were found in the scanned tree");
  if (!hasCi) limitations.push("No GitHub Actions workflow file was found in the scanned tree");
  limitations.push("Tests and contract behavior were not executed by this analyzer");

  const evidence = files.slice(0, 8).map((file) => ({
    label: file.path,
    path: file.path,
    url: file.url,
  }));
  const classification = classifyRepository(repository, readme);
  const summary = readme
    ? readme.replace(/^#.*$/gm, "").replace(new RegExp(String.fromCharCode(96, 96, 96) + "[\\s\\S]*?" + String.fromCharCode(96, 96, 96), "g"), "").replace(/\s+/g, " ").trim().slice(0, 650)
    : repository.description ?? "No README or repository description was found.";

  return {
    name: repository.name,
    fullName: repository.full_name,
    url: repository.html_url,
    description: repository.description ?? "No GitHub description is available.",
    defaultBranch: repository.default_branch,
    commitSha,
    pushedAt: repository.pushed_at,
    language: repository.language,
    stars: repository.stargazers_count,
    classification,
    totalScore,
    scoreBreakdown,
    summary,
    strengths,
    limitations,
    evidence,
    testStatus: testCount > 0 ? "found-not-executed" : "no-test-evidence",
    scoreDisclaimer: "Heuristic repository triage only. This score is not a security audit, does not prove correctness, and does not indicate that tests passed.",
  };
}
