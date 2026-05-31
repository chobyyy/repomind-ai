export type GitHubRepository = {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  description: string | null;
  private: boolean;
  default_branch: string;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
};

export type NormalizedRepository = {
  id: string;
  name: string;
  fullName: string;
  owner: string;
  description: string | null;
  private: boolean;
  defaultBranch: string;
  htmlUrl: string;
  language: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  createdAt: string;
  updatedAt: string;
  pushedAt: string | null;
};

export type GitHubTreeItem = {
  path: string;
  mode: string;
  type: "blob" | "tree" | "commit";
  sha: string;
  size?: number;
  url: string;
};

export type GitHubTreeResponse = {
  sha: string;
  truncated: boolean;
  tree: GitHubTreeItem[];
};

export type GitHubFileContent = {
  name: string;
  path: string;
  sha: string;
  size: number;
  encoding?: string;
  content?: string;
};

export type ParsedGitHubRepoUrl = {
  owner: string;
  repo: string;
};
