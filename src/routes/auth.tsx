import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { Github, ArrowRight, Lock, GitBranch, Building2 } from "lucide-react";
import { repos } from "@/lib/mock-data";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connect GitHub — RepoMind AI" },
      { name: "description", content: "Connect your GitHub account to analyze repositories with RepoMind AI." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  return (
    <div className="min-h-screen flex bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(circle_at_30%_30%,black,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-ai/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Left: auth */}
      <div className="w-full lg:w-[44%] flex flex-col px-6 sm:px-12 py-10 relative">
        <Logo />

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <div className="text-xs font-bold text-cyan-ai uppercase tracking-widest mb-3">Sign in</div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Connect your GitHub</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Authorize RepoMind to scan your repositories. Read-only access. Revoke anytime.
          </p>

          <button className="w-full px-5 py-3.5 bg-foreground text-background font-semibold rounded-lg flex items-center justify-center gap-2.5 hover:bg-foreground/90 transition-all active:scale-[0.99]">
            <Github className="size-5" />
            Continue with GitHub
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border-subtle" />
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">or email</span>
            <div className="flex-1 h-px bg-border-subtle" />
          </div>

          <div className="space-y-3">
            <input
              type="email"
              placeholder="you@company.dev"
              className="w-full px-4 py-3 bg-surface-2/50 border border-border-subtle rounded-lg text-sm outline-none focus:border-cyan-ai/40 transition-colors"
            />
            <button className="w-full px-5 py-3 bg-surface-2 border border-border-subtle rounded-lg text-sm font-medium hover:border-cyan-ai/30 transition-colors">
              Continue with email
            </button>
          </div>

          <p className="text-[11px] text-muted-foreground mt-8 leading-relaxed">
            By continuing you agree to our Terms and acknowledge our Privacy Policy.
          </p>

          <Link
            to="/dashboard"
            className="mt-8 inline-flex items-center gap-2 text-xs text-cyan-ai hover:underline"
          >
            Skip and explore the demo <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>

      {/* Right: repos preview */}
      <div className="hidden lg:flex flex-1 border-l border-border-subtle bg-sidebar/40 p-10 relative">
        <div className="w-full max-w-md mx-auto flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="size-4 text-muted-foreground" />
              <span className="font-medium">acme-engineering</span>
              <span className="text-muted-foreground">/ organization</span>
            </div>
            <select className="bg-surface-2/50 border border-border-subtle rounded-md text-xs px-2 py-1 text-muted-foreground">
              <option>main</option>
              <option>develop</option>
              <option>canary</option>
            </select>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto">
            {repos.map((r) => (
              <div
                key={r.id}
                className="p-3.5 rounded-lg border border-border-subtle bg-card hover:border-cyan-ai/30 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  {r.private ? (
                    <Lock className="size-3.5 text-amber-ai" />
                  ) : (
                    <GitBranch className="size-3.5 text-cyan-ai" />
                  )}
                  <span className="text-sm font-medium text-foreground">{r.org}/{r.name}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">{r.updated}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground pl-5">
                  <span>{r.language}</span>
                  <span>★ {r.stars.toLocaleString()}</span>
                  <span className="ml-auto opacity-0 group-hover:opacity-100 text-cyan-ai transition-opacity">
                    Import →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
