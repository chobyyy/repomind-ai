import type { RepositoryFile } from "./repository.types";

const MAX_FILE_SIZE_BYTES = 1_000_000;

const ignoredDirectorySegments = new Set([
  "node_modules",
  "dist",
  "build",
  ".next",
  ".git",
  "coverage",
  ".cache",
  ".vercel",
]);

const ignoredFiles = new Set([
  ".env",
  ".env.local",
  ".env.production",
  "package-lock.json",
  "bun.lock",
  "bun.lockb",
  "yarn.lock",
  "pnpm-lock.yaml",
]);

const languageByExtension = new Map<string, string>([
  [".ts", "TypeScript"],
  [".tsx", "TypeScript React"],
  [".js", "JavaScript"],
  [".jsx", "JavaScript React"],
  [".py", "Python"],
  [".java", "Java"],
  [".cs", "C#"],
  [".go", "Go"],
  [".rs", "Rust"],
  [".php", "PHP"],
  [".sql", "SQL"],
  [".json", "JSON"],
  [".md", "Markdown"],
  [".yml", "YAML"],
  [".yaml", "YAML"],
  [".prisma", "Prisma"],
  [".html", "HTML"],
  [".css", "CSS"],
  [".scss", "SCSS"],
  [".txt", "Text"],
  [".xml", "XML"],
]);

const ignoredExtensions = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".ico",
  ".mp4",
  ".mov",
  ".avi",
  ".mp3",
  ".wav",
  ".zip",
  ".tar",
  ".gz",
  ".rar",
  ".7z",
  ".pdf",
  ".exe",
  ".dll",
  ".so",
  ".dylib",
  ".bin",
  ".lock",
]);

function getPathParts(path: string): string[] {
  return path.split("/").filter(Boolean);
}

function getFileName(path: string): string {
  return getPathParts(path).at(-1) ?? path;
}

function getExtension(path: string): string {
  const fileName = getFileName(path);
  const lastDot = fileName.lastIndexOf(".");
  return lastDot > -1 ? fileName.slice(lastDot).toLowerCase() : "";
}

export function detectLanguageFromPath(path: string): string {
  const fileName = getFileName(path);

  if (fileName === "Dockerfile") return "Dockerfile";

  return languageByExtension.get(getExtension(path)) ?? "Unknown";
}

export function shouldAnalyzeFile(path: string, size?: number): boolean {
  const parts = getPathParts(path);
  const fileName = getFileName(path);
  const extension = getExtension(path);

  if (size != null && size > MAX_FILE_SIZE_BYTES) return false;
  if (parts.some((part) => ignoredDirectorySegments.has(part))) return false;
  if (ignoredFiles.has(fileName)) return false;
  if (ignoredExtensions.has(extension)) return false;

  return fileName === "Dockerfile" || languageByExtension.has(extension);
}

export function toRepositoryFile(path: string, size?: number): RepositoryFile {
  return {
    path,
    size,
    language: detectLanguageFromPath(path),
  };
}

export function isIgnoredPath(path: string): boolean {
  const parts = path.split("/");
  return parts.some((part) => ignoredDirectorySegments.has(part));
}
