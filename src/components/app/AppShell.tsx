import { useState, type ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { CommandPalette } from "./CommandPalette";
import { Bell, Command } from "lucide-react";

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <AppSidebar onCommand={() => setCmdOpen(true)} />
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 px-6 border-b border-border-subtle flex items-center justify-between sticky top-0 z-30 bg-background/80 backdrop-blur-xl">
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-foreground truncate">{title}</h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {actions}
            <button
              onClick={() => setCmdOpen(true)}
              className="size-9 rounded-lg border border-border-subtle bg-surface-2/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-cyan-ai/30 transition-colors"
              aria-label="Open command palette"
            >
              <Command className="size-4" />
            </button>
            <button className="size-9 rounded-lg border border-border-subtle bg-surface-2/40 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="size-4" />
            </button>
          </div>
        </header>
        <div className="flex-1 p-6 md:p-8 animate-fade-in">{children}</div>
        <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
      </main>
    </div>
  );
}
