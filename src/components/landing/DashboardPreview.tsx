export function DashboardPreview() {
  return (
    <section id="dashboard" className="py-24 px-6 border-t border-border-subtle bg-surface-1/40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-bold text-purple-ai uppercase tracking-widest mb-3">Workspace</div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gradient-brand">
            A developer workspace for the AI era.
          </h2>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-card overflow-hidden shadow-2xl shadow-black/40">
          <div className="grid grid-cols-12">
            {/* Sidebar */}
            <aside className="col-span-3 border-r border-border-subtle p-4 space-y-6 bg-sidebar">
              <div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest px-2">
                  Active Analysis
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-cyan-ai/5 text-cyan-ai border border-cyan-ai/20 text-xs font-medium">
                    <div className="size-1.5 rounded-full bg-cyan-ai animate-glow-pulse" />
                    nextjs-core-repo
                  </div>
                  <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-muted-foreground text-xs">
                    <div className="size-1.5 rounded-full bg-muted-foreground/40" />
                    stripe-integration
                  </div>
                  <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-muted-foreground text-xs">
                    <div className="size-1.5 rounded-full bg-muted-foreground/40" />
                    auth-service-v2
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-border-subtle bg-surface-2/50">
                <div className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest">
                  System Health
                </div>
                <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden mb-2">
                  <div className="h-full w-[84%] bg-gradient-to-r from-cyan-ai to-purple-ai" />
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">Maintainability</span>
                  <span className="text-cyan-ai font-bold">84/100</span>
                </div>
              </div>
            </aside>

            {/* Main */}
            <div className="col-span-9 p-6 space-y-6 bg-background/60">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { l: "Modules", v: "42", c: "text-foreground" },
                  { l: "Complexity", v: "Medium", c: "text-amber-ai" },
                  { l: "Onboarding", v: "High", c: "text-emerald-ai" },
                ].map((s) => (
                  <div key={s.l} className="p-4 rounded-xl border border-border-subtle bg-card">
                    <div className="text-xs text-muted-foreground mb-1.5">{s.l}</div>
                    <div className={`text-2xl font-semibold ${s.c}`}>{s.v}</div>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-xl border border-border-subtle bg-card relative overflow-hidden">
                <div className="text-xs font-medium text-muted-foreground mb-8">
                  Architecture Flow (Mermaid Auto-Generated)
                </div>
                <div className="flex flex-col items-center gap-8">
                  <div className="px-5 py-2 rounded border border-purple-ai/40 bg-purple-ai/10 text-purple-ai text-xs font-mono">
                    Frontend (Next.js)
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div className="flex gap-6">
                    {["Auth Service", "Data Layer", "Cloud Events"].map((n) => (
                      <div
                        key={n}
                        className="px-4 py-2 rounded border border-cyan-ai/40 bg-cyan-ai/10 text-cyan-ai text-xs font-mono"
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
