import { getServerEnv } from "../shared/env.server";
import { AppError } from "../shared/errors";
import type {
  GitHubFileContent,
  GitHubRepository,
  GitHubTreeResponse,
  NormalizedRepository,
  ParsedGitHubRepoUrl,
} from "./github.types";

const GITHUB_API_BASE_URL = "https://api.github.com";

function getGitHubHeaders(): HeadersInit {
  const env = getServerEnv();
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function requestGitHub<T>(path: string): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE_URL}${path}`, {
    headers: getGitHubHeaders(),
  });

  if (!response.ok) {
    const remaining = response.headers.get("x-ratelimit-remaining");

    if (response.status === 403 && remaining === "0") {
      throw new AppError(
        "GITHUB_RATE_LIMITED",
        "GitHub API rate limit reached. Add a GITHUB_TOKEN or try again later.",
        429,
      );
    }

    if (response.status === 404) {
      throw new AppError("GITHUB_NOT_FOUND", "GitHub resource was not found.", 404);
    }

    throw new AppError(
      "GITHUB_HTTP_ERROR",
      `GitHub API request failed with status ${response.status}.`,
      response.status,
    );
  }

  return (await response.json()) as T;
}

export function normalizeRepository(repo: GitHubRepository): NormalizedRepository {
  return {
    id: String(repo.id),
    name: repo.name,
    fullName: repo.full_name,
    owner: repo.owner.login,
    description: repo.description,
    private: repo.private,
    defaultBranch: repo.default_branch,
    htmlUrl: repo.html_url,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,
  };
}

export async function getUserRepositories(username: string): Promise<NormalizedRepository[]> {
  const repos = await requestGitHub<GitHubRepository[]>(
    `/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
  );

  return repos.map(normalizeRepository);
}

export async function getRepository(owner: string, repo: string): Promise<NormalizedRepository> {
  const githubRepo = await requestGitHub<GitHubRepository>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
  );

  return normalizeRepository(githubRepo);
}

export async function getRepositoryTree(
  owner: string,
  repo: string,
  branch: string,
): Promise<GitHubTreeResponse> {
  return requestGitHub<GitHubTreeResponse>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
  );
}

export async function getFileContent(
  owner: string,
  repo: string,
  path: string,
  branch: string,
): Promise<GitHubFileContent> {
  return requestGitHub<GitHubFileContent>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`,
  );
}

export function parseGitHubRepoUrl(url: string): ParsedGitHubRepoUrl {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    throw new AppError("BAD_REQUEST", "Enter a valid GitHub repository URL.", 400);
  }

  if (parsed.hostname !== "github.com" && parsed.hostname !== "www.github.com") {
    throw new AppError("BAD_REQUEST", "Only github.com repository URLs are supported.", 400);
  }

  const [owner, repoWithSuffix] = parsed.pathname.split("/").filter(Boolean);
  const repo = repoWithSuffix?.replace(/\.git$/, "");

  if (!owner || !repo) {
    throw new AppError("BAD_REQUEST", "GitHub URL must include owner and repository.", 400);
  }

  return { owner, repo };
}
