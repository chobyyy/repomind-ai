import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Github,
  MessageSquareCode,
  FileText,
  Network,
  GitBranch,
  Search,
} from "lucide-react";

const commands = [
  { to: "/dashboard", label: "Go to Dashboard", icon: LayoutDashboard, hint: "Workspace" },
  { to: "/github", label: "GitHub Repositories", icon: Github, hint: "Source" },
  { to: "/repo/nextjs-core-repo", label: "Open nextjs-core-repo analysis", icon: GitBranch, hint: "Analysis" },
  { to: "/chat", label: "Ask AI Assistant", icon: MessageSquareCode, hint: "AI" },
  { to: "/readme", label: "Generate README", icon: FileText, hint: "Docs" },
  { to: "/architecture", label: "Architecture Visualizer", icon: Network, hint: "Diagrams" },
];

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open) return null;

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div
      className="fixed inset-0 z-[100] bg-background/70 backdrop-blur-sm flex items-start justify-center pt-32 px-4 animate-fade-in"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-xl rounded-xl border border-border-subtle bg-card overflow-hidden shadow-2xl glow-cyan animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle">
          <Search className="size-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type a command or search…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-surface-2 border border-border-subtle text-[10px] text-muted-foreground">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">No results.</div>
          )}
          {filtered.map((c) => (
            <button
              key={c.to}
              onClick={() => {
                navigate({ to: c.to });
                onOpenChange(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-cyan-ai/10 hover:text-cyan-ai transition-colors"
            >
              <c.icon className="size-4" />
              <span className="flex-1 text-left">{c.label}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{c.hint}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
