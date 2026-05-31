import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";

export function LandingNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border-subtle bg-background/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground font-medium">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#dashboard" className="hover:text-foreground transition-colors">Product</a>
          <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          <a href="#" className="hover:text-foreground transition-colors">Docs</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/auth" className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sign in
          </Link>
          <Link
            to="/dashboard"
            className="px-4 py-1.5 text-sm font-medium bg-foreground text-background rounded-full hover:bg-foreground/90 transition-colors"
          >
            Start Analyzing
          </Link>
        </div>
      </div>
    </nav>
  );
}
