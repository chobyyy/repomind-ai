import { createFileRoute, Link } from "@tanstack/react-router";
import { LandingNavbar } from "@/components/landing/Navbar";
import { FakeTerminal } from "@/components/landing/Terminal";
import { Features } from "@/components/landing/Features";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { ArrowRight, Github, Upload } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RepoMind AI — Understand Any Codebase Instantly" },
      { name: "description", content: "AI-native platform to analyze repositories, generate documentation, visualize architecture and onboard developers automatically." },
      { property: "og:title", content: "RepoMind AI — Understand Any Codebase Instantly" },
      { property: "og:description", content: "Analyze repos, generate README, visualize architecture, and chat with your codebase." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[420px] bg-cyan-ai/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[400px] h-[300px] bg-purple-ai/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-ai/20 bg-cyan-ai/5 text-cyan-ai text-xs font-medium mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-ai opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-ai" />
            </span>
            Introducing v2.0 — Deep Architecture Analysis
          </div>

          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 text-gradient-brand animate-fade-in">
            Understand Any Codebase
            <br />
            Instantly with AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in">
            Analyze repositories, generate documentation, visualize architecture and onboard
            developers automatically — in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in">
            <Link
              to="/auth"
              className="w-full sm:w-auto px-6 py-3 bg-foreground text-background font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-foreground/90 transition-all active:scale-95"
            >
              <Github className="size-4" />
              Connect GitHub
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-6 py-3 bg-surface-2 border border-border-subtle text-foreground font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-surface-2/70 hover:border-cyan-ai/30 transition-all"
            >
              <Upload className="size-4" />
              Analyze Local Repo
            </Link>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-20 relative animate-fade-in">
          <FakeTerminal />
        </div>

        <div className="max-w-5xl mx-auto mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-xs uppercase tracking-widest text-muted-foreground/60 font-medium">
          <span>Next.js</span>
          <span>React</span>
          <span>Python</span>
          <span>Go</span>
          <span>Rust</span>
          <span>Node.js</span>
          <span>TypeScript</span>
          <span>Django</span>
        </div>
      </section>

      <Features />
      <DashboardPreview />

      {/* CTA */}
      <section className="py-24 px-6 border-t border-border-subtle">
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-purple-ai/5 blur-[100px] rounded-full -z-10" />
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gradient-brand mb-6">
            Ship faster. Onboard sooner.
          </h2>
          <p className="text-muted-foreground mb-10 text-lg">
            Stop reading code. Start understanding it.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-cyan-ai to-purple-ai text-background font-semibold rounded-lg hover:scale-[1.02] transition-transform glow-cyan"
          >
            Open Dashboard <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border-subtle py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© 2026 RepoMind AI. All systems operational.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">GitHub</a>
            <a href="#" className="hover:text-foreground">Twitter</a>
            <a href="#" className="hover:text-foreground">Changelog</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
