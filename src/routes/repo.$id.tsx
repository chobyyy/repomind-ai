import { createFileRoute, Link, useParams, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { FileTree, buildTreeFromPaths } from "@/components/app/FileTree";
import { analyzeRepository } from "@/lib/api/github.functions";
import { fileTree, insights, repos, techStack } from "@/lib/mock-data";
import { useQuery } from "@tanstack/react-query";
import type { RepositoryAnalysisSummary } from "@/server/backend/repositories/repository.types";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  GitBranch,
  Lock,
  FileText,
  Network,
  MessageSquareCode,
} from "lucide-react";

export const Route = createFileRoute("/repo/$id")({
  head: ({ params }) => ({
    meta: [{ title: `${params.id} - RepoMind AI` }],
  }),
  component: RepoView,
});

const tabs = ["Overview", "Architecture", "Dependencies", "Endpoints", "Insights"] as const;

function RepoView() {
  const { id } = useParams({ from: "/repo/$id" });
  const router = useRouter();
  const isMock = !id.includes("--");
  const repo = repos.find((item) => item.id === id) ?? repos[0];
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");

  // Manual analysis input
  const [repoUrl, setRepoUrl] = useState(() => getInitialRepoUrl(id, repo));

  // Determine owner & repo for dynamic queries
  const parsedRepoInfo = id.includes("--") ? id.split("--") : null;
  const dynamicOwner = parsedRepoInfo?.[0];
  const dynamicName = parsedRepoInfo?.[1];
  const dynamicUrl = parsedRepoInfo ? `https://github.com/${dynamicOwner}/${dynamicName}` : "";

  // Set up useQuery to query the analyzeRepository server function
  const { data: analysis, isLoading, error: queryError } = useQuery({
    queryKey: ["repo-analysis", id],
    queryFn: async () => {
      if (isMock) return null;
      const res = await analyzeRepository({ data: { repoUrl: dynamicUrl } });
      if (!res.ok) {
        throw new Error(res.error.message);
      }
      return res.data;
    },
    enabled: !isMock,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  function handleAnalyze(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!repoUrl.trim()) return;

    try {
      const urlObj = new URL(repoUrl.trim());
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
      const parts = repoUrl.trim().split("/");
      if (parts.length === 2 && parts[0] && parts[1]) {
        router.navigate({ to: "/repo/$id", params: { id: `${parts[0]}--${parts[1]}` } });
      } else {
        alert("Enter a valid GitHub URL or 'owner/repo' shorthand.");
      }
    }
  }

  // Premium neon Loading state
  if (isLoading) {
    return (
      <AppShell title={dynamicOwner && dynamicName ? `${dynamicOwner}/${dynamicName}` : "Analyzing"} subtitle="Analyzing repository...">
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
          <div className="relative mb-6">
            <div className="size-16 rounded-full border-t-2 border-r-2 border-cyan-ai animate-spin" />
            <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-purple-ai animate-spin-reverse" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight mb-2">Analyzing Codebase</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Fetching GitHub repository tree, detecting technologies, and constructing source map...
          </p>
        </div>
      </AppShell>
    );
  }

  // Failure state
  const errorMsg = queryError ? (queryError as Error).message : null;
  if (errorMsg) {
    return (
      <AppShell title="Analysis Failed" subtitle="Something went wrong during repository scanning">
        <div className="max-w-md mx-auto my-12 text-center p-6 border border-destructive/20 bg-destructive/5 rounded-xl">
          <AlertTriangle className="size-12 text-destructive mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Analysis Failed</h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            {errorMsg}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.invalidate()}
              className="px-4 py-2 bg-foreground text-background text-xs font-semibold rounded-lg hover:bg-foreground/90 transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/github"
              className="px-4 py-2 border border-border-subtle bg-surface-2/40 text-xs font-semibold rounded-lg hover:border-cyan-ai/30 transition-colors"
            >
              Back to Import
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const title = analysis ? analysis.repository.fullName : `${repo.org}/${repo.name}`;
  const subtitle = analysis
    ? `Branch ${analysis.repository.defaultBranch} - Updated ${formatUpdatedDate(analysis.repository.updatedAt)}`
    : `Branch ${repo.branch} - Updated ${repo.updated}`;

  const treeData = analysis?.filePaths
    ? buildTreeFromPaths(analysis.filePaths)
    : fileTree;

  const activeTechStack = analysis?.detectedFrameworks.length
    ? analysis.detectedFrameworks
    : techStack;

  const dynamicInsights = analysis
    ? [
        ...(analysis.hasReadme
          ? [
              {
                kind: "ok" as const,
                title: "Repository Documentation",
                body: "Found a README file, providing starting guidelines for developer onboarding.",
              },
            ]
          : [
              {
                kind: "warn" as const,
                title: "Missing README",
                body: "No README file found. A README is crucial to help new developers understand and run the repository.",
              },
            ]),
        ...(analysis.hasEnvExample
          ? [
              {
                kind: "ok" as const,
                title: "Environment Variables",
                body: "Found `.env.example`. Configuration options are documented for developers.",
              },
            ]
          : [
              {
                kind: "warn" as const,
                title: "Missing Configuration Template",
                body: "No `.env.example` file found. It is highly recommended to document required environment variables.",
              },
            ]),
        ...(analysis.hasDockerfile
          ? [
              {
                kind: "ok" as const,
                title: "Docker Configuration",
                body: "Found a Dockerfile. The application is prepared for containerized deployments.",
              },
            ]
          : [
              {
                kind: "info" as const,
                title: "Containerization",
                body: "No Dockerfile detected. Consider adding one to simplify production packaging and scaling.",
              },
            ]),
        ...(analysis.hasTests
          ? [
              {
                kind: "ok" as const,
                title: "Testing Suite",
                body: "Test files detected (test/spec or __tests__). The codebase is equipped with automated tests.",
              },
            ]
          : [
              {
                kind: "warn" as const,
                title: "No Tests Detected",
                body: "No test files matching standard patterns (*.test.*, *.spec.*, or /tests/) were found. Consider adding testing suites to ensure reliability.",
              },
            ]),
        ...(analysis.totalFiles > 400
          ? [
              {
                kind: "info" as const,
                title: "Large Codebase Scale",
                body: `Codebase contains ${analysis.totalFiles} total files. Consider modularizing or using microservices if structural complexity increases.`,
              },
            ]
          : analysis.totalFiles <= 50
            ? [
                {
                  kind: "info" as const,
                  title: "Compact Codebase Scale",
                  body: `Codebase contains ${analysis.totalFiles} total files, suggesting a lightweight microservice or modular library structure.`,
                },
              ]
            : []),
      ]
    : insights;

  const mainLang = analysis?.mainLanguage ?? "Unknown";
  const frameworkText = analysis?.detectedFrameworks.length
    ? ` It is built using ${analysis.detectedFrameworks.join(", ")}.`
    : "";
  const pmText = analysis?.detectedPackageManagers.length
    ? ` Dependency management is handled via ${analysis.detectedPackageManagers.join(" & ")}.`
    : "";
  const summaryText = analysis
    ? `RepoMind analyzed the public GitHub tree for ${analysis.repository.fullName}. The codebase is primarily written in ${mainLang} and consists of ${analysis.analyzableFiles} source files (excluding ignored files like build products and third-party modules).${frameworkText}${pmText}`
    : "This section still uses temporary mock data. Run a repository analysis above to see real GitHub structure data without changing the existing visual layout.";

  return (
    <AppShell
      title={title}
      subtitle={subtitle}
      actions={
        <>
          <Link
            to="/readme"
            className="hidden md:inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border border-border-subtle bg-surface-2/40 text-xs font-medium hover:border-cyan-ai/30"
          >
            <FileText className="size-3.5" /> README
          </Link>
          <Link
            to="/architecture"
            className="hidden md:inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border border-border-subtle bg-surface-2/40 text-xs font-medium hover:border-cyan-ai/30"
          >
            <Network className="size-3.5" /> Diagram
          </Link>
          <Link
            to="/chat"
            className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-foreground text-background text-xs font-medium"
          >
            <MessageSquareCode className="size-3.5" /> Ask AI
          </Link>
        </>
      }
    >
      <div className="rounded-xl border border-border-subtle bg-card p-5 mb-6">
        <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row gap-3">
          <input
            value={repoUrl}
            onChange={(event) => setRepoUrl(event.target.value)}
            placeholder="https://github.com/owner/repository or owner/repository"
            className="flex-1 rounded-lg border border-border-subtle bg-surface-2/40 px-3 h-10 text-sm outline-none focus:border-cyan-ai/50"
          />
          <button
            type="submit"
            disabled={repoUrl.trim().length === 0}
            className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-foreground text-background text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            Analyze repository
          </button>
        </form>

        {analysis && <RepositoryAnalysisPanel analysis={analysis} />}
      </div>

      <div className="rounded-xl border border-border-subtle bg-card p-5 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-ai/5 via-transparent to-purple-ai/5 pointer-events-none" />
        <div className="relative flex items-center gap-4">
          <div className="size-12 rounded-lg bg-surface-2 border border-border-subtle flex items-center justify-center">
            {repo.private ? (
              <Lock className="size-5 text-amber-ai" />
            ) : (
              <GitBranch className="size-5 text-cyan-ai" />
            )}
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">{title}</div>
            <div className="text-xs text-muted-foreground">
              {analysis
                ? `${analysis.mainLanguage ?? "Unknown"} - ${analysis.analyzableFiles} analyzable files`
                : `${repo.language} - ${repo.modules} modules - complexity ${repo.complexity}`}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 text-right">
            <Stat
              label="Files"
              value={String(analysis?.totalFiles ?? repo.modules)}
              accent="text-emerald-ai"
            />
            <Stat
              label="Analyzable"
              value={String(analysis?.analyzableFiles ?? repo.health)}
              accent="text-cyan-ai"
            />
            <Stat
              label="Ignored"
              value={String(analysis?.ignoredFiles ?? repo.complexity)}
              accent="text-amber-ai"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 rounded-xl border border-border-subtle bg-card p-4">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 px-2">
            File structure
          </div>
          <FileTree tree={treeData} />
        </div>

        <div className="lg:col-span-9 space-y-6">
          <div className="rounded-xl border border-border-subtle bg-card overflow-hidden">
            <div className="border-b border-border-subtle flex overflow-x-auto">
              {tabs.map((item) => (
                <button
                  key={item}
                  onClick={() => setTab(item)}
                  className={`px-4 py-3 text-xs font-medium transition-colors relative ${
                    tab === item ? "text-cyan-ai" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item}
                  {tab === item && (
                    <span className="absolute left-3 right-3 -bottom-px h-px bg-cyan-ai" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-6">
              {tab === "Overview" && (
                <>
                  <Section title={analysis ? "Repository Structure Summary" : "AI Summary"}>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {summaryText}
                    </p>
                  </Section>
                  <Section title="Technologies detected">
                    <div className="flex flex-wrap gap-2">
                      {activeTechStack.map((item) => (
                        <span
                          key={item}
                          className="px-2.5 py-1 text-xs rounded-md bg-surface-2 border border-border-subtle"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </Section>
                </>
              )}

              {tab === "Architecture" && (
                <Section title="System diagram">
                  <MockDiagram />
                </Section>
              )}

              {tab === "Dependencies" && (
                <Section title={analysis ? "Package managers" : "Top dependencies"}>
                  {analysis ? (
                    <TagList
                      values={analysis.detectedPackageManagers}
                      empty="No package manager lockfile detected."
                    />
                  ) : (
                    <MockDependencies />
                  )}
                </Section>
              )}

              {tab === "Endpoints" && (
                <Section title="Detected API endpoints">
                  <p className="text-sm text-muted-foreground">
                    Endpoint discovery still uses mock placeholders. Real endpoint extraction will
                    require parsing file contents in a later backend phase.
                  </p>
                </Section>
              )}

              {tab === "Insights" && (
                <div className="space-y-3">
                  {insights.map((item, key) => {
                    const Icon =
                      item.kind === "warn"
                        ? AlertTriangle
                        : item.kind === "ok"
                          ? CheckCircle2
                          : Info;
                    const color =
                      item.kind === "warn"
                        ? "text-amber-ai border-amber-ai/20 bg-amber-ai/5"
                        : item.kind === "ok"
                          ? "text-emerald-ai border-emerald-ai/20 bg-emerald-ai/5"
                          : "text-cyan-ai border-cyan-ai/20 bg-cyan-ai/5";
                    return (
                      <div key={key} className={`p-4 rounded-lg border ${color}`}>
                        <div className="flex items-start gap-3">
                          <Icon className="size-4 mt-0.5 shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-foreground">{item.title}</div>
                            <div className="text-xs text-muted-foreground mt-1">{item.body}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function RepositoryAnalysisPanel({ analysis }: { analysis: RepositoryAnalysisSummary }) {
  return (
    <div className="mt-5 space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Metric label="Total files" value={analysis.totalFiles} />
        <Metric label="Analyzable" value={analysis.analyzableFiles} />
        <Metric label="Ignored" value={analysis.ignoredFiles} />
        <Metric label="Main language" value={analysis.mainLanguage ?? "Unknown"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Section title="Languages">
          <div className="space-y-2">
            {analysis.languages.map((language) => (
              <div key={language.language} className="text-xs">
                <div className="flex justify-between text-muted-foreground mb-1">
                  <span>{language.language}</span>
                  <span>
                    {language.files} files - {language.percentage}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                  <div className="h-full bg-cyan-ai" style={{ width: `${language.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Signals">
          <div className="grid grid-cols-2 gap-2">
            <BooleanSignal label="README" value={analysis.hasReadme} />
            <BooleanSignal label="Dockerfile" value={analysis.hasDockerfile} />
            <BooleanSignal label=".env.example" value={analysis.hasEnvExample} />
            <BooleanSignal label="Tests" value={analysis.hasTests} />
          </div>
        </Section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Section title="Frameworks">
          <TagList
            values={analysis.detectedFrameworks}
            empty="No framework detected from structure."
          />
        </Section>
        <Section title="Package managers">
          <TagList values={analysis.detectedPackageManagers} empty="No lockfile detected." />
        </Section>
        <Section title="Important files">
          <TagList
            values={analysis.importantFiles.slice(0, 12)}
            empty="No important files detected."
          />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
        {title}
      </div>
      {children}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface-2/40 p-3">
      <div className="text-lg font-semibold text-foreground truncate">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

function BooleanSignal({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface-2/40 px-3 py-2 text-xs">
      <span className={value ? "text-emerald-ai" : "text-muted-foreground"}>
        {value ? "Yes" : "No"}
      </span>{" "}
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

function TagList({ values, empty }: { values: string[]; empty: string }) {
  if (values.length === 0) {
    return <p className="text-sm text-muted-foreground">{empty}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <span
          key={value}
          className="px-2.5 py-1 text-xs rounded-md bg-surface-2 border border-border-subtle"
        >
          {value}
        </span>
      ))}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div>
      <div className={`text-lg font-semibold ${accent}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

function MockDependencies() {
  return (
    <ul className="text-sm divide-y divide-border-subtle">
      {[
        ["next", "14.2.4"],
        ["react", "18.3.1"],
        ["@tanstack/react-query", "5.50.0"],
        ["next-auth", "5.0.0-beta.18"],
        ["zod", "3.23.8"],
      ].map(([name, version]) => (
        <li key={name} className="flex items-center justify-between py-2.5">
          <span className="font-mono text-foreground">{name}</span>
          <span className="text-xs text-muted-foreground">{version}</span>
        </li>
      ))}
    </ul>
  );
}

function MockDiagram() {
  return (
    <div className="p-8 rounded-lg border border-border-subtle bg-surface-2/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="relative flex flex-col items-center gap-10">
        <Node label="Frontend (Next.js)" color="purple" />
        <div className="w-px h-8 bg-border" />
        <Node label="API Gateway" color="cyan" />
        <div className="w-px h-8 bg-border" />
        <div className="flex gap-10">
          <Node label="Auth Service" color="cyan" />
          <Node label="Data Layer" color="cyan" />
          <Node label="Cloud Events" color="cyan" />
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="flex gap-10">
          <Node label="PostgreSQL" color="emerald" />
          <Node label="Redis Cache" color="emerald" />
        </div>
      </div>
    </div>
  );
}

function Node({ label, color }: { label: string; color: "cyan" | "purple" | "emerald" }) {
  const cls = {
    cyan: "border-cyan-ai/40 bg-cyan-ai/10 text-cyan-ai",
    purple: "border-purple-ai/40 bg-purple-ai/10 text-purple-ai",
    emerald: "border-emerald-ai/40 bg-emerald-ai/10 text-emerald-ai",
  }[color];
  return <div className={`px-4 py-2 rounded border font-mono text-xs ${cls}`}>{label}</div>;
}

function getInitialRepoUrl(id: string, repo: (typeof repos)[number]) {
  const [owner, name] = id.includes("--") ? id.split("--") : [repo.org, repo.name];
  return `https://github.com/${owner}/${name}`;
}

function formatUpdatedDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
