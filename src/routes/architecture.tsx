import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { Download, ZoomIn, ZoomOut, RotateCcw, Sparkles } from "lucide-react";

export const Route = createFileRoute("/architecture")({
  head: () => ({ meta: [{ title: "Architecture — RepoMind AI" }] }),
  component: ArchitecturePage,
});

function ArchitecturePage() {
  return (
    <AppShell
      title="Architecture Visualizer"
      subtitle="Mermaid-style diagrams auto-generated from your codebase"
      actions={
        <>
          <div className="hidden md:flex items-center gap-1 mr-1">
            <IconBtn><ZoomOut className="size-3.5" /></IconBtn>
            <IconBtn><ZoomIn className="size-3.5" /></IconBtn>
            <IconBtn><RotateCcw className="size-3.5" /></IconBtn>
          </div>
          <button className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-foreground text-background text-xs font-medium">
            <Download className="size-3.5" /> Export SVG
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 rounded-xl border border-border-subtle bg-card overflow-hidden relative">
          <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
          <svg viewBox="0 0 1000 720" className="w-full h-[640px] relative">
            <defs>
              <linearGradient id="edge" x1="0" x2="1">
                <stop offset="0%" stopColor="var(--cyan-ai)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="var(--purple-ai)" stopOpacity="0.4" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* edges */}
            {[
              [500, 110, 500, 220],
              [500, 280, 220, 400],
              [500, 280, 500, 400],
              [500, 280, 780, 400],
              [220, 460, 360, 590],
              [500, 460, 500, 590],
              [780, 460, 640, 590],
            ].map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#edge)" strokeWidth={1.5} strokeDasharray="4 4" />
            ))}

            <DiagramNode x={500} y={70} label="Web Client" color="purple" />
            <DiagramNode x={500} y={250} label="API Gateway · tRPC" color="cyan" wide />
            <DiagramNode x={220} y={430} label="Auth Service" color="cyan" />
            <DiagramNode x={500} y={430} label="Data Service" color="cyan" />
            <DiagramNode x={780} y={430} label="Events Service" color="cyan" />
            <DiagramNode x={360} y={620} label="PostgreSQL" color="emerald" />
            <DiagramNode x={500} y={620} label="Redis" color="emerald" />
            <DiagramNode x={640} y={620} label="Stripe" color="amber" />
          </svg>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border-subtle bg-card p-4">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
              Legend
            </div>
            <ul className="space-y-2 text-xs">
              <Legend color="bg-purple-ai" label="Client" />
              <Legend color="bg-cyan-ai" label="Service" />
              <Legend color="bg-emerald-ai" label="Datastore" />
              <Legend color="bg-amber-ai" label="External" />
            </ul>
          </div>

          <div className="rounded-xl border border-border-subtle bg-card p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-ai/5 to-purple-ai/5 pointer-events-none" />
            <div className="relative">
              <div className="text-[10px] font-bold text-cyan-ai uppercase tracking-widest mb-2 inline-flex items-center gap-1.5">
                <Sparkles className="size-3" /> AI Summary
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed">
                Web traffic enters through the tRPC gateway and fans out to three
                domain services. Persistence is split between PostgreSQL (write
                of record) and Redis (cache + sessions). Billing flows are
                offloaded to Stripe asynchronously.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border-subtle bg-card p-4">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
              Diagram source
            </div>
            <pre className="text-[10px] font-mono leading-relaxed text-muted-foreground overflow-x-auto">
{`graph TD
  Web[Web Client] --> GW[API Gateway]
  GW --> Auth
  GW --> Data
  GW --> Events
  Auth --> PG[(PostgreSQL)]
  Data --> Redis[(Redis)]
  Events --> Stripe`}
            </pre>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function DiagramNode({
  x, y, label, color, wide = false,
}: { x: number; y: number; label: string; color: "cyan" | "purple" | "emerald" | "amber"; wide?: boolean }) {
  const w = wide ? 220 : 160;
  const h = 56;
  const colors = {
    cyan: { stroke: "var(--cyan-ai)", fill: "color-mix(in oklab, var(--cyan-ai) 10%, transparent)" },
    purple: { stroke: "var(--purple-ai)", fill: "color-mix(in oklab, var(--purple-ai) 10%, transparent)" },
    emerald: { stroke: "var(--emerald-ai)", fill: "color-mix(in oklab, var(--emerald-ai) 10%, transparent)" },
    amber: { stroke: "var(--amber-ai)", fill: "color-mix(in oklab, var(--amber-ai) 10%, transparent)" },
  }[color];
  return (
    <g filter="url(#glow)">
      <rect
        x={x - w / 2} y={y - h / 2} width={w} height={h} rx={10}
        fill={colors.fill} stroke={colors.stroke} strokeWidth={1.2}
      />
      <text x={x} y={y + 4} textAnchor="middle" fill={colors.stroke}
        fontFamily="JetBrains Mono, monospace" fontSize={12} fontWeight={500}>
        {label}
      </text>
    </g>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <li className="flex items-center gap-2 text-muted-foreground">
      <span className={`size-2.5 rounded-sm ${color}`} />
      {label}
    </li>
  );
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="size-9 rounded-lg border border-border-subtle bg-surface-2/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-cyan-ai/30 transition-colors">
      {children}
    </button>
  );
}
