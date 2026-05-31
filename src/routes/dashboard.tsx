import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { repos } from "@/lib/mock-data";
import {
  ArrowUpRight,
  FileText,
  Github,
  Network,
  Sparkles,
  GitBranch,
  Lock,
  Plus,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — RepoMind AI" }],
  }),
  component: Dashboard,
});

const metrics = [
  { label: "Repos analyzed", value: "24", delta: "+3 this week", icon: Github, accent: "text-cyan-ai" },
  { label: "Docs generated", value: "128", delta: "+18 this week", icon: FileText, accent: "text-purple-ai" },
  { label: "AI insights", value: "612", delta: "94 actionable", icon: Sparkles, accent: "text-emerald-ai" },
  { label: "Architecture reports", value: "47", delta: "+6 this week", icon: Network, accent: "text-amber-ai" },
];

const activity = [
  { who: "Alex", what: "Generated README for", target: "stripe-integration", when: "12m" },
  { who: "AI", what: "Detected circular dependency in", target: "auth-service-v2", when: "1h" },
  { who: "Sam", what: "Imported repo", target: "design-system", when: "3h" },
  { who: "AI", what: "Generated architecture diagram for", target: "nextjs-core-repo", when: "5h" },
  { who: "Maya", what: "Asked assistant about", target: "ml-pipeline auth flow", when: "1d" },
];

function Dashboard() {
  return (
    <AppShell
      title="Workspace"
      subtitle="All your repositories, insights and reports in one place"
      actions={
        <Link
          to="/github"
          className="hidden md:inline-flex items-center gap-2 px-3 h-9 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
        >
          <Plus className="size-4" /> Import Repo
        </Link>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="relative p-5 rounded-xl border border-border-subtle bg-card overflow-hidden group hover:border-cyan-ai/30 transition-colors"
          >
            <div className="absolute -right-6 -top-6 size-24 rounded-full bg-cyan-ai/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-4">
              <m.icon className={`size-4 ${m.accent}`} />
              <ArrowUpRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-2xl font-semibold tracking-tight">{m.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
            <div className="text-[10px] text-emerald-ai mt-3 font-medium">{m.delta}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Repo list */}
        <div className="lg:col-span-2 rounded-xl border border-border-subtle bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Repositories</h3>
              <p className="text-xs text-muted-foreground">Recently analyzed</p>
            </div>
            <Link to="/github" className="text-xs text-cyan-ai hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-border-subtle">
            {repos.map((r) => (
              <Link
                key={r.id}
                to="/repo/$id"
                params={{ id: r.id }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-surface-2/40 transition-colors group"
              >
                <div className="size-10 rounded-lg bg-gradient-to-br from-cyan-ai/20 to-purple-ai/20 border border-border-subtle flex items-center justify-center">
                  {r.private ? (
                    <Lock className="size-4 text-amber-ai" />
                  ) : (
                    <GitBranch className="size-4 text-cyan-ai" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-muted-foreground">{r.org}/</span>
                    <span className="text-foreground truncate">{r.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-2 border border-border-subtle text-muted-foreground">
                      {r.branch}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                    <span>{r.language}</span>
                    <span>★ {r.stars.toLocaleString()}</span>
                    <span>⑂ {r.forks.toLocaleString()}</span>
                    <span>· {r.updated}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${r.health > 80 ? "text-emerald-ai" : r.health > 70 ? "text-amber-ai" : "text-destructive"}`}>
                    {r.health}
                  </div>
                  <div className="text-[10px] text-muted-foreground">health</div>
                </div>
                <ArrowUpRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>

        {/* Activity + quick actions */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border-subtle bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border-subtle">
              <h3 className="text-sm font-semibold">Recent activity</h3>
            </div>
            <div className="p-2">
              {activity.map((a, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-2/40 transition-colors"
                >
                  <div className={`mt-1 size-1.5 rounded-full shrink-0 ${a.who === "AI" ? "bg-purple-ai" : "bg-cyan-ai"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-foreground">
                      <span className="font-medium">{a.who}</span>{" "}
                      <span className="text-muted-foreground">{a.what}</span>{" "}
                      <span className="font-medium text-cyan-ai">{a.target}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{a.when} ago</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border-subtle bg-card p-5 relative overflow-hidden">
            <div className="absolute -inset-px rounded-xl pointer-events-none bg-gradient-to-br from-cyan-ai/10 via-transparent to-purple-ai/10" />
            <h3 className="text-sm font-semibold mb-1 relative">Quick actions</h3>
            <p className="text-xs text-muted-foreground mb-4 relative">Jump back into your flow.</p>
            <div className="grid grid-cols-2 gap-2 relative">
              {[
                { to: "/chat", label: "Ask AI", icon: Sparkles },
                { to: "/readme", label: "New README", icon: FileText },
                { to: "/architecture", label: "Diagram", icon: Network },
                { to: "/github", label: "Import", icon: Github },
              ].map((q) => (
                <Link
                  key={q.to}
                  to={q.to}
                  className="flex flex-col items-start gap-2 p-3 rounded-lg border border-border-subtle bg-surface-2/40 hover:bg-surface-2 hover:border-cyan-ai/30 transition-colors"
                >
                  <q.icon className="size-4 text-cyan-ai" />
                  <span className="text-xs font-medium">{q.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
