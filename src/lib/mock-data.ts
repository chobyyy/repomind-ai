export type Repo = {
  id: string;
  name: string;
  org: string;
  private: boolean;
  language: string;
  stars: number;
  forks: number;
  branch: string;
  updated: string;
  health: number;
  modules: number;
  complexity: "Low" | "Medium" | "High";
};

// Temporary mock data kept for the current visual prototype.
// Real GitHub metadata now flows through src/lib/api/github.functions.ts.
export const repos: Repo[] = [
  {
    id: "nextjs-core-repo",
    name: "nextjs-core-repo",
    org: "vercel",
    private: false,
    language: "TypeScript",
    stars: 124_320,
    forks: 26_510,
    branch: "canary",
    updated: "2h ago",
    health: 84,
    modules: 42,
    complexity: "Medium",
  },
  {
    id: "stripe-integration",
    name: "stripe-integration",
    org: "internal",
    private: true,
    language: "TypeScript",
    stars: 12,
    forks: 3,
    branch: "main",
    updated: "5h ago",
    health: 91,
    modules: 18,
    complexity: "Low",
  },
  {
    id: "auth-service-v2",
    name: "auth-service-v2",
    org: "internal",
    private: true,
    language: "Go",
    stars: 4,
    forks: 0,
    branch: "develop",
    updated: "1d ago",
    health: 72,
    modules: 27,
    complexity: "High",
  },
  {
    id: "design-system",
    name: "design-system",
    org: "acme",
    private: false,
    language: "TypeScript",
    stars: 4_212,
    forks: 312,
    branch: "main",
    updated: "3d ago",
    health: 88,
    modules: 64,
    complexity: "Medium",
  },
  {
    id: "ml-pipeline",
    name: "ml-pipeline",
    org: "research",
    private: true,
    language: "Python",
    stars: 240,
    forks: 18,
    branch: "main",
    updated: "1w ago",
    health: 67,
    modules: 31,
    complexity: "High",
  },
];

export const fileTree = [
  {
    name: "src",
    type: "dir" as const,
    children: [
      {
        name: "app",
        type: "dir" as const,
        children: [
          { name: "layout.tsx", type: "file" as const },
          { name: "page.tsx", type: "file" as const },
          {
            name: "api",
            type: "dir" as const,
            children: [
              {
                name: "auth",
                type: "dir" as const,
                children: [{ name: "route.ts", type: "file" as const }],
              },
              {
                name: "users",
                type: "dir" as const,
                children: [{ name: "route.ts", type: "file" as const }],
              },
            ],
          },
        ],
      },
      {
        name: "components",
        type: "dir" as const,
        children: [
          {
            name: "ui",
            type: "dir" as const,
            children: [
              { name: "button.tsx", type: "file" as const },
              { name: "card.tsx", type: "file" as const },
            ],
          },
          { name: "header.tsx", type: "file" as const },
        ],
      },
      {
        name: "lib",
        type: "dir" as const,
        children: [
          { name: "auth.ts", type: "file" as const },
          { name: "db.ts", type: "file" as const },
          { name: "utils.ts", type: "file" as const },
        ],
      },
      {
        name: "services",
        type: "dir" as const,
        children: [
          { name: "redis-cache.service.ts", type: "file" as const },
          { name: "main-pipeline.ts", type: "file" as const },
        ],
      },
    ],
  },
  { name: "package.json", type: "file" as const },
  { name: "tsconfig.json", type: "file" as const },
  { name: "README.md", type: "file" as const },
];

export const insights = [
  {
    kind: "warn",
    title: "Circular dependency",
    body: "Detected between /auth and /users modules.",
  },
  {
    kind: "info",
    title: "JWT lifetime",
    body: "Tokens expire in 15m. Refresh handled via /api/refresh.",
  },
  { kind: "ok", title: "Test coverage", body: "Coverage at 78% — above team threshold." },
  {
    kind: "warn",
    title: "Duplicate logic",
    body: "Similar validation in /lib/validators and /api/users.",
  },
];

export const techStack = [
  "Next.js 14",
  "TypeScript",
  "TailwindCSS",
  "PostgreSQL",
  "Redis",
  "NextAuth",
  "tRPC",
];
