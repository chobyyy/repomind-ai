import { useEffect, useState } from "react";

const lines = [
  { t: "$ repomind scan --repo github.com/vercel/next.js", c: "text-cyan-ai" },
  { t: "[1/4] Scanning 2,492 files...", c: "text-muted-foreground" },
  { t: "[2/4] Detecting patterns: Next.js, TypeScript, TailwindCSS", c: "text-muted-foreground" },
  { t: "[3/4] Mapping architectural dependencies...", c: "text-muted-foreground" },
  { t: "[4/4] Generating Mermaid diagrams & README.md...", c: "text-muted-foreground" },
  { t: "✓ Analysis complete. Dashboard ready.", c: "text-emerald-ai" },
];

export function FakeTerminal() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= lines.length) return;
    const id = setTimeout(() => setVisible((v) => v + 1), 550);
    return () => clearTimeout(id);
  }, [visible]);

  return (
    <div className="relative rounded-xl border border-border-subtle bg-card overflow-hidden shadow-2xl shadow-black/60">
      <div className="absolute -inset-px rounded-xl pointer-events-none opacity-50 bg-gradient-to-b from-cyan-ai/10 via-transparent to-purple-ai/10" />
      <div className="relative flex items-center gap-2 px-4 py-3 border-b border-border-subtle bg-surface-2/50">
        <div className="flex gap-1.5">
          <div className="size-3 rounded-full bg-destructive/30 border border-destructive/40" />
          <div className="size-3 rounded-full bg-amber-ai/30 border border-amber-ai/40" />
          <div className="size-3 rounded-full bg-emerald-ai/30 border border-emerald-ai/40" />
        </div>
        <div className="text-xs text-muted-foreground font-mono flex-1 text-center pr-8">
          repomind — scan --repo github.com/vercel/next.js
        </div>
      </div>
      <div className="relative p-6 font-mono text-sm leading-relaxed min-h-[260px]">
        {lines.slice(0, visible).map((line, i) => (
          <div key={i} className={`${line.c} animate-fade-in`}>{line.t}</div>
        ))}
        {visible >= lines.length && (
          <div className="mt-4 p-4 rounded bg-surface-2/60 border border-border-subtle animate-fade-in">
            <div className="text-[10px] text-muted-foreground uppercase mb-2 font-bold tracking-widest">
              AI Insights
            </div>
            <div className="text-foreground/90 text-sm">
              Detected core service pattern in{" "}
              <code className="text-cyan-ai">/lib/services</code>. Architecture follows a clean
              hexagonal model with dependency injection via custom hooks.
            </div>
          </div>
        )}
        {visible < lines.length && (
          <span className="inline-block w-2 h-4 bg-cyan-ai align-middle animate-blink" />
        )}
      </div>
    </div>
  );
}
