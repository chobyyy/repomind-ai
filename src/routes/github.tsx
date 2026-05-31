import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { getGitHubUserRepositories } from "@/lib/api/github.functions";
import { repos } from "@/lib/mock-data";
import type { NormalizedRepository } from "@/server/backend/github/github.types";
import { GitBranch, Lock, Search, Star, GitFork, Users, GitCommit } from "lucide-react";

export const Route = createFileRoute("/github")({
  head: () => ({ meta: [{ title: "GitHub Repos - RepoMind AI" }] }),
  component: GithubPage,
});

function GithubPage() {
  const [username, setUsername] = useState("");
  const [directUrl, setDirectUrl] = useState("");
  const [repositories, setRepositories] = useState<NormalizedRepository[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Temporary mock fallback: real GitHub data replaces this after a search.
  const displayedRepositories =
    repositories ??
    repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: `${repo.org}/${repo.name}`,
      owner: repo.org,
      description: null,
      private: repo.private,
      defaultBranch: repo.branch,
      htmlUrl: "#",
      language: repo.language,
      stars: repo.stars,
      forks: repo.forks,
      openIssues: 0,
      createdAt: "",
      updatedAt: repo.updated,
      pushedAt: null,
    }));
  const featuredRepository = displayedRepositories[0];

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await getGitHubUserRepositories({ data: { username } });

    if (result.ok) {
      setRepositories(result.data);
    } else {
      setRepositories([]);
      setError(result.error.message);
    }

    setIsLoading(false);
  }

  function handleUrlAnalyze(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!directUrl.trim()) return;

    try {
      const urlObj = new URL(directUrl.trim());
      if (urlObj.hostname !== "github.com" && urlObj.hostname !== "www.github.com") {
        alert("Only github.com repository URLs are supported.");
        return;
      }
      const parts = urlObj.pathname.split("/").filter(Boolean);
      const owner = parts[0];
      const name = parts[1]?.replace(/\.git$/, "");
      if (owner && name) {
        router.navigate({ to: "/repo/$id", params: { id: `${owner}--${name}` } });
      } else {
        alert("Invalid GitHub URL. Must include owner and repository name.");
      }
    } catch {
      // Treat as owner/repo shorthand
      const parts = directUrl.trim().split("/");
      if (parts.length === 2 && parts[0] && parts[1]) {
        router.navigate({ to: "/repo/$id", params: { id: `${parts[0]}--${parts[1]}` } });
      } else {
        alert("Enter a valid GitHub URL or 'owner/repo' shorthand.");
      }
    }
  }

  return (
    <AppShell title="GitHub Repositories" subtitle="Browse, import and scan any repo">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-[55%] space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">
              Search User Repositories
            </label>
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-card border border-border-subtle focus-within:border-cyan-ai/40 transition-colors"
            >
              <Search className="size-4 text-muted-foreground" />
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="e.g. facebook, vercel, octocat"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                disabled={isLoading || username.trim().length === 0}
                className="bg-surface-2/60 border border-border-subtle rounded-md text-xs px-3 py-1.5 text-foreground hover:border-cyan-ai/30 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Searching..." : "Search"}
              </button>
            </form>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">
              Analyze Direct Repository URL
            </label>
            <form
              onSubmit={handleUrlAnalyze}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-card border border-border-subtle focus-within:border-cyan-ai/40 transition-colors"
            >
              <Search className="size-4 text-muted-foreground" />
              <input
                value={directUrl}
                onChange={(event) => setDirectUrl(event.target.value)}
                placeholder="e.g. https://github.com/facebook/react or owner/repo"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                disabled={directUrl.trim().length === 0}
                className="bg-surface-2/60 border border-border-subtle rounded-md text-xs px-3 py-1.5 text-foreground hover:border-cyan-ai/30 transition-colors"
              >
                Analyze
              </button>
            </form>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="rounded-xl border border-border-subtle bg-card overflow-hidden divide-y divide-border-subtle">
            {displayedRepositories.length === 0 && (
              <div className="px-5 py-10 text-center text-sm text-muted-foreground">
                No public repositories found for this GitHub user.
              </div>
            )}

            {displayedRepositories.map((repo) => (
              <Link
                key={repo.id}
                to="/repo/$id"
                params={{ id: `${repo.owner}--${repo.name}` }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-surface-2/40 transition-colors"
              >
                <div className="size-9 rounded-lg bg-surface-2 border border-border-subtle flex items-center justify-center">
                  {repo.private ? (
                    <Lock className="size-4 text-amber-ai" />
                  ) : (
                    <GitBranch className="size-4 text-cyan-ai" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    <span className="text-muted-foreground">{repo.owner}/</span>
                    <span className="text-foreground">{repo.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1">
                    <span className="inline-flex items-center gap-1">
                      <Star className="size-3" />
                      {repo.stars.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GitFork className="size-3" />
                      {repo.forks.toLocaleString()}
                    </span>
                    <span>{repo.language ?? "Unknown"}</span>
                    <span>updated {formatUpdatedDate(repo.updatedAt)}</span>
                  </div>
                </div>
                <span className="text-xs text-cyan-ai">Analyze -&gt;</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="lg:flex-1">
          <div className="rounded-xl border border-border-subtle bg-card overflow-hidden">
            <div className="p-6 border-b border-border-subtle bg-gradient-to-br from-cyan-ai/5 via-transparent to-purple-ai/5 relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm">
                    <GitBranch className="size-4 text-cyan-ai" />
                    <span className="text-muted-foreground">
                      {featuredRepository?.owner ?? "vercel"}/
                    </span>
                    <span className="font-semibold">
                      {featuredRepository?.name ?? "nextjs-core-repo"}
                    </span>
                    <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-surface-2 border border-border-subtle">
                      {featuredRepository?.defaultBranch ?? "canary"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 max-w-md">
                    {featuredRepository?.description ??
                      "Search a GitHub user to load real public repositories from the GitHub API."}
                  </p>
                </div>
                <Link
                  to="/repo/$id"
                  params={{
                    id: `${featuredRepository?.owner ?? "vercel"}--${featuredRepository?.name ?? "nextjs-core-repo"}`,
                  }}
                  className="inline-flex items-center px-3 h-9 rounded-lg bg-foreground text-background text-sm font-medium"
                >
                  Analyze
                </Link>
              </div>

              <div className="grid grid-cols-4 gap-3 mt-6">
                {[
                  {
                    label: "Stars",
                    value: formatNumber(featuredRepository?.stars ?? 124_300),
                    icon: Star,
                  },
                  {
                    label: "Forks",
                    value: formatNumber(featuredRepository?.forks ?? 26_500),
                    icon: GitFork,
                  },
                  {
                    label: "Issues",
                    value: formatNumber(featuredRepository?.openIssues ?? 0),
                    icon: Users,
                  },
                  {
                    label: "Branch",
                    value: featuredRepository?.defaultBranch ?? "canary",
                    icon: GitCommit,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="p-3 rounded-lg border border-border-subtle bg-card"
                  >
                    <stat.icon className="size-3.5 text-cyan-ai mb-2" />
                    <div className="text-sm font-semibold truncate">{stat.value}</div>
                    <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                Repository Summary
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">
                {repositories
                  ? "This panel is now backed by real GitHub repository metadata. Open Analyze to inspect structure, files, languages, frameworks and package managers."
                  : "Repository rows are temporary mock data until you search a GitHub username. The search box calls the real backend and GitHub API."}
              </p>

              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-6 mb-3">
                Languages
              </div>
              <div className="flex h-2 rounded-full overflow-hidden border border-border-subtle">
                <div className="bg-cyan-ai" style={{ width: "62%" }} />
                <div className="bg-purple-ai" style={{ width: "22%" }} />
                <div className="bg-emerald-ai" style={{ width: "10%" }} />
                <div className="bg-amber-ai" style={{ width: "6%" }} />
              </div>
              <div className="flex flex-wrap gap-4 mt-3 text-[11px] text-muted-foreground">
                <span>
                  <span className="inline-block size-2 rounded-full bg-cyan-ai mr-1.5" />
                  TypeScript 62%
                </span>
                <span>
                  <span className="inline-block size-2 rounded-full bg-purple-ai mr-1.5" />
                  Rust 22%
                </span>
                <span>
                  <span className="inline-block size-2 rounded-full bg-emerald-ai mr-1.5" />
                  JavaScript 10%
                </span>
                <span>
                  <span className="inline-block size-2 rounded-full bg-amber-ai mr-1.5" />
                  Other 6%
                </span>
              </div>

              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-6 mb-3">
                Recent commits
              </div>
              <div className="space-y-2">
                {[
                  { message: "Temporary mock commit data", author: "RepoMind", time: "now" },
                  {
                    message: "Real repository metadata is available above",
                    author: "GitHub",
                    time: "API",
                  },
                  {
                    message: "Code analysis runs from the Analyze view",
                    author: "RepoMind",
                    time: "next",
                  },
                ].map((commit) => (
                  <div
                    key={commit.message}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-2/40 border border-border-subtle"
                  >
                    <GitCommit className="size-3.5 text-cyan-ai" />
                    <span className="text-xs text-foreground flex-1 truncate">
                      {commit.message}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {commit.author} - {commit.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function formatUpdatedDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function formatNumber(value: number) {
  return new Intl.NumberFormat(undefined, { notation: "compact" }).format(value);
}
