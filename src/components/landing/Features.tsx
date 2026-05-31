import {
  FileText,
  Network,
  Github,
  MessageSquareCode,
  GitBranch,
  GraduationCap,
  Sparkles,
  Workflow,
} from "lucide-react";

const features = [
  { icon: FileText, title: "README Generation", desc: "From empty repo to a complete onboarding doc in seconds." },
  { icon: Network, title: "Architecture Analysis", desc: "Mermaid diagrams auto-generated from your real codebase." },
  { icon: Github, title: "GitHub Scanning", desc: "Public, private, any branch — scan in one click." },
  { icon: MessageSquareCode, title: "Code Explanations", desc: "Ask in natural language. Get answers grounded in source." },
  { icon: Workflow, title: "Service Mapping", desc: "Detect microservices, endpoints and dependencies." },
  { icon: GraduationCap, title: "Onboarding Docs", desc: "Hand new devs a guided tour of any repository." },
  { icon: Sparkles, title: "AI Insights", desc: "Surface circular deps, duplicate logic, and dead code." },
  { icon: GitBranch, title: "Multi-branch", desc: "Compare architecture across branches and PRs." },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-6 border-t border-border-subtle">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
          <div className="text-xs font-bold text-cyan-ai uppercase tracking-widest mb-3">Capabilities</div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gradient-brand">
            Everything you need to understand any codebase.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border-subtle rounded-2xl overflow-hidden border border-border-subtle">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group p-6 bg-card hover:bg-surface-2 transition-colors relative"
            >
              <div className="size-9 rounded-lg bg-surface-2 border border-border-subtle flex items-center justify-center mb-5 group-hover:border-cyan-ai/40 group-hover:text-cyan-ai transition-colors">
                <Icon className="size-4" />
              </div>
              <h3 className="font-medium text-foreground mb-1.5">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
