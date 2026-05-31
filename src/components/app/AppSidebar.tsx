import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  GitBranch,
  MessageSquareCode,
  FileText,
  Network,
  Github,
  Settings,
  Search,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/github", label: "GitHub Repos", icon: Github },
  { to: "/repo/nextjs-core-repo", label: "Analysis", icon: GitBranch },
  { to: "/chat", label: "AI Assistant", icon: MessageSquareCode },
  { to: "/readme", label: "README Generator", icon: FileText },
  { to: "/architecture", label: "Architecture", icon: Network },
];

export function AppSidebar({ onCommand }: { onCommand?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border-subtle bg-sidebar h-screen sticky top-0">
      <div className="h-16 px-5 flex items-center border-b border-border-subtle">
        <Logo />
      </div>

      <button
        onClick={onCommand}
        className="mx-3 mt-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-2/50 border border-border-subtle text-xs text-muted-foreground hover:text-foreground hover:border-cyan-ai/30 transition-colors"
      >
        <Search className="size-3.5" />
        <span className="flex-1 text-left">Search anything…</span>
        <kbd className="px-1.5 py-0.5 rounded bg-background border border-border-subtle text-[10px]">⌘K</kbd>
      </button>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <div className="text-[10px] font-bold text-muted-foreground uppercase mb-2 tracking-widest px-3">
          Workspace
        </div>
        {nav.map(({ to, label, icon: Icon }) => {
          const active = path === to || (to !== "/dashboard" && path.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-cyan-ai/10 text-cyan-ai border border-cyan-ai/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-2/50 border border-transparent"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border-subtle space-y-2">
        <Link
          to="/auth"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-surface-2/50 transition-colors"
        >
          <Settings className="size-4" />
          Settings
        </Link>
        <div className="flex items-center gap-3 p-2 rounded-lg bg-surface-2/40 border border-border-subtle">
          <div className="size-8 rounded-full bg-gradient-to-br from-cyan-ai to-purple-ai" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-foreground truncate">Alex Morgan</div>
            <div className="text-[10px] text-muted-foreground truncate">alex@acme.dev</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
