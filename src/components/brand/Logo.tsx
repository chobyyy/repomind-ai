import { Link } from "@tanstack/react-router";

export function Logo({ withText = true }: { withText?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="relative size-8 rounded-lg bg-gradient-to-br from-cyan-ai to-purple-ai flex items-center justify-center shadow-[0_0_20px_-4px_var(--cyan-ai)] transition-transform group-hover:scale-105">
        <div className="size-3.5 border-2 border-background rounded-sm rotate-45" />
      </div>
      {withText && (
        <span className="font-semibold text-base tracking-tight text-foreground">
          RepoMind <span className="text-muted-foreground font-normal">AI</span>
        </span>
      )}
    </Link>
  );
}
