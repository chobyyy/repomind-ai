import type { NormalizedRepository } from "../github/github.types";

export type RepositoryFile = {
  path: string;
  size?: number;
  language: string;
};

export type RepositoryLanguageStats = {
  language: string;
  files: number;
  percentage: number;
};

export type RepositoryAnalysisSummary = {
  repository: NormalizedRepository;
  totalFiles: number;
  analyzableFiles: number;
  ignoredFiles: number;
  languages: RepositoryLanguageStats[];
  mainLanguage: string | null;
  importantFiles: string[];
  detectedFrameworks: string[];
  detectedPackageManagers: string[];
  hasReadme: boolean;
  hasDockerfile: boolean;
  hasEnvExample: boolean;
  hasTests: boolean;
  filePaths: string[];
};

export type RepositoryImportResult = {
  owner: string;
  repo: string;
  summary: RepositoryAnalysisSummary;
};
