export const GITHUB_OWNER = "saftanasdalihin";

const GITHUB_API_ROOT = "https://api.github.com";
const USER_AGENT = "safta-ai-portfolio";

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  default_branch: string;
  fork: boolean;
  archived: boolean;
  private: boolean;
  language: string | null;
  topics?: string[];
  pushed_at: string | null;
  updated_at: string | null;
  stargazers_count: number;
  size: number;
  owner: { login: string };
}

export interface GitHubTreeEntry {
  path: string;
  type: "blob" | "tree" | "commit";
  sha: string;
  size?: number;
  url?: string;
}

export interface GitHubTree {
  sha: string;
  truncated: boolean;
  tree: GitHubTreeEntry[];
}

export interface GitHubCommit {
  sha: string;
  commit: { tree: { sha: string } };
}

export function isValidRepositoryName(name: string): boolean {
  return /^[A-Za-z0-9_.-]{1,100}$/.test(name);
}

export async function githubApi<T>(path: string): Promise<T> {
  const url = new URL(path, GITHUB_API_ROOT);
  const isUserRepositoryList = url.pathname === "/users/" + GITHUB_OWNER + "/repos" || url.pathname === "/user/repos";
  const isOwnedRepositoryPath = url.pathname.startsWith("/repos/" + GITHUB_OWNER + "/");

  if (
    url.origin !== GITHUB_API_ROOT ||
    (!isUserRepositoryList && !isOwnedRepositoryPath)
  ) {
    throw new Error("GitHub API path is outside the allowed read-only scope.");
  }

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": USER_AGENT,
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = "Bearer " + token;

  const response = await fetch(url, { headers, cache: "no-store" });
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    const remaining = response.headers.get("x-ratelimit-remaining");
    const message =
      response.status === 403 && remaining === "0"
        ? "GitHub API rate limit reached. Configure a read-only GITHUB_TOKEN."
        : "GitHub API request failed (" + response.status + "): " + detail;
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export async function fetchRawRepositoryFile(
  repositoryName: string,
  commitSha: string,
  filePath: string,
  maxBytes = 60_000
): Promise<string | null> {
  if (!isValidRepositoryName(repositoryName) || !/^[a-f0-9]{40}$/i.test(commitSha)) {
    throw new Error("Invalid repository reference.");
  }

  const safePath = filePath.split("/").map((segment) => encodeURIComponent(segment)).join("/");
  const rawUrl = "https://raw.githubusercontent.com/" + GITHUB_OWNER + "/" +
    repositoryName + "/" + commitSha + "/" + safePath;
  const rawResponse = await fetch(rawUrl, { cache: "no-store" });

  if (rawResponse.ok) {
    const lengthHeader = rawResponse.headers.get("content-length");
    if (lengthHeader && Number(lengthHeader) > maxBytes) return null;
    const rawContent = await rawResponse.text();
    if (new TextEncoder().encode(rawContent).byteLength > maxBytes) return null;
    return rawContent;
  }

  // Private repositories need authenticated API access; public raw reads avoid
  // spending a GitHub REST API request for every source file.
  if (rawResponse.status !== 404 || !process.env.GITHUB_TOKEN) return null;

  const path = "/repos/" + GITHUB_OWNER + "/" + encodeURIComponent(repositoryName) +
    "/contents/" + safePath + "?ref=" + encodeURIComponent(commitSha);
  try {
    const response = await githubApi<{ encoding?: string; content?: string; size?: number }>(path);
    if (response.encoding !== "base64" || typeof response.content !== "string") return null;
    if ((response.size ?? 0) > maxBytes) return null;
    const content = Buffer.from(response.content.replace(/\s/g, ""), "base64").toString("utf8");
    if (new TextEncoder().encode(content).byteLength > maxBytes) return null;
    return content;
  } catch (error) {
    if (String(error).includes("(404)")) return null;
    throw error;
  }
}
