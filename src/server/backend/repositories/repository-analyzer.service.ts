import { getRepository, getRepositoryTree, parseGitHubRepoUrl } from "../github/github.service";
import type { GitHubTreeItem } from "../github/github.types";
import { shouldAnalyzeFile, toRepositoryFile, isIgnoredPath } from "./repository-filter.service";
import type {
  RepositoryAnalysisSummary,
  RepositoryFile,
  RepositoryLanguageStats,
} from "./repository.types";

const importantPathMatchers: Array<(path: string) => boolean> = [
  (path) => path === "README.md",
  (path) => path === "package.json",
  (path) => path === "tsconfig.json",
  (path) => path === "vite.config.ts",
  (path) => path === "next.config.js",
  (path) => path === "tailwind.config.js" || path === "tailwind.config.ts",
  (path) => path === "docker-compose.yml" || path === "docker-compose.yaml",
  (path) => path === "Dockerfile",
  (path) => path === "prisma/schema.prisma",
  (path) => path === ".env.example",
  (path) => path === "src/main.tsx",
  (path) => path === "src/App.tsx",
  (path) => path === "src/routes" || path.startsWith("src/routes/"),
  (path) => path === "src/components" || path.startsWith("src/components/"),
  (path) => path === "src/server" || path.startsWith("src/server/"),
  (path) => path === "src/lib" || path.startsWith("src/lib/"),
];

function filePaths(tree: GitHubTreeItem[]): string[] {
  return tree.map((item) => item.path);
}

function hasPath(paths: string[], predicate: (path: string) => boolean): boolean {
  return paths.some(predicate);
}

function calculateLanguageStats(files: RepositoryFile[]): RepositoryLanguageStats[] {
  const counts = new Map<string, number>();

  for (const file of files) {
    counts.set(file.language, (counts.get(file.language) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([language, count]) => ({
      language,
      files: count,
      percentage: files.length === 0 ? 0 : Math.round((count / files.length) * 100),
    }))
    .sort((a, b) => b.files - a.files);
}

function detectFrameworks(paths: string[]): string[] {
  const frameworks = new Set<string>();
  const pathSet = new Set(paths);

  if (paths.some((path) => path.endsWith(".tsx") || path.endsWith(".jsx"))) {
    frameworks.add("React");
  }
  if (pathSet.has("vite.config.ts") || pathSet.has("vite.config.js")) {
    frameworks.add("Vite");
  }
  if (pathSet.has("src/routeTree.gen.ts") || pathSet.has("src/router.tsx")) {
    frameworks.add("TanStack Router");
  }
  if (
    pathSet.has("src/start.ts") ||
    pathSet.has("app.config.ts") ||
    paths.some((path) => path.includes("react-start"))
  ) {
    frameworks.add("TanStack Start");
  }
  if (
    paths.some((path) => path.startsWith("pages/") || path.startsWith("app/")) ||
    pathSet.has("next.config.js")
  ) {
    frameworks.add("Next.js");
  }
  if (pathSet.has("package.json")) {
    frameworks.add("Node.js");
  }
  if (paths.some((path) => path.includes("express"))) {
    frameworks.add("Express");
  }
  if (paths.some((path) => path.includes("nest") || path === "nest-cli.json")) {
    frameworks.add("NestJS");
  }
  if (paths.some((path) => path.includes("manage.py") || path.includes("django"))) {
    frameworks.add("Django");
  }
  if (paths.some((path) => path.includes("artisan") || path.includes("laravel"))) {
    frameworks.add("Laravel");
  }
  if (pathSet.has("prisma/schema.prisma")) {
    frameworks.add("Prisma");
  }
  if (paths.some((path) => path.startsWith("tailwind.config.") || path.includes("tailwind.css"))) {
    frameworks.add("Tailwind CSS");
  }

  return Array.from(frameworks);
}

function detectPackageManagers(paths: string[]): string[] {
  const managers = new Set<string>();
  const pathSet = new Set(paths);

  if (pathSet.has("package-lock.json")) managers.add("npm");
  if (pathSet.has("yarn.lock")) managers.add("yarn");
  if (pathSet.has("pnpm-lock.yaml")) managers.add("pnpm");
  if (pathSet.has("bun.lock") || pathSet.has("bun.lockb")) managers.add("bun");

  return Array.from(managers);
}

export async function analyzeRepositoryFromUrl(url: string): Promise<RepositoryAnalysisSummary> {
  const { owner, repo } = parseGitHubRepoUrl(url);
  const repository = await getRepository(owner, repo);
  const tree = await getRepositoryTree(owner, repo, repository.defaultBranch);
  const blobs = tree.tree.filter((item) => item.type === "blob");
  const paths = filePaths(tree.tree);

  const analyzableRepositoryFiles = blobs
    .filter((item) => shouldAnalyzeFile(item.path, item.size))
    .map((item) => toRepositoryFile(item.path, item.size));

  const languages = calculateLanguageStats(analyzableRepositoryFiles);

  return {
    repository,
    totalFiles: blobs.length,
    analyzableFiles: analyzableRepositoryFiles.length,
    ignoredFiles: Math.max(0, blobs.length - analyzableRepositoryFiles.length),
    languages,
    mainLanguage: languages[0]?.language ?? repository.language,
    importantFiles: paths.filter((path) => importantPathMatchers.some((matcher) => matcher(path))),
    detectedFrameworks: detectFrameworks(paths),
    detectedPackageManagers: detectPackageManagers(paths),
    hasReadme: hasPath(paths, (path) => /^readme(\.|$)/i.test(path)),
    hasDockerfile: hasPath(paths, (path) => path === "Dockerfile" || path.endsWith("/Dockerfile")),
    hasEnvExample: hasPath(
      paths,
      (path) => path === ".env.example" || path.endsWith("/.env.example"),
    ),
    hasTests: hasPath(
      paths,
      (path) =>
        path.includes("__tests__/") ||
        path.includes("/tests/") ||
        /\.(test|spec)\.[jt]sx?$/.test(path),
    ),
    filePaths: paths.filter((path) => !isIgnoredPath(path)),
  };
}
