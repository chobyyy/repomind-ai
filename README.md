# RepoMind AI

RepoMind AI is a platform for analyzing GitHub repositories, detecting structure, technologies, important files, and preparing future AI-powered code analysis.

## Current Project Status

The project started as a visual prototype with mock data. It now includes a backend foundation built with TanStack Start server functions that can connect to GitHub, list public repositories, and analyze public repository structure without using a database or AI yet.

Some visual areas still use temporary mock data. Those areas are intentionally preserved so the current interface does not break while backend functionality is added incrementally.

## Technologies Used

- React
- TypeScript
- TanStack Start
- TanStack Router
- TanStack Query
- Vite
- Tailwind CSS
- Zod
- GitHub REST API

## Installation

```bash
bun install
```

The project also includes npm-compatible scripts:

```bash
npm install
```

## Environment Variables

Create a `.env` file from `.env.example`:

```bash
GITHUB_TOKEN=
APP_ENV=development
PUBLIC_APP_URL=http://localhost:3000
```

`GITHUB_TOKEN` is optional. If it is missing, RepoMind AI still works with GitHub public API limits. The token is read only by server-side code and is never exposed to the frontend.

## Run Locally

```bash
bun run dev
```

or:

```bash
npm run dev
```

## Backend Functions Implemented

- `getGitHubUserRepositories`: lists public repositories for a GitHub user and returns normalized repository data.
- `getRepositoryBasicInfo`: gets normalized metadata for a specific public repository.
- `analyzeRepository`: parses a GitHub repository URL, reads the repository tree, filters useful source files, detects languages, important files, frameworks, package managers, and basic repository signals.

## Backend Structure

```text
src/server/backend/
  github/
    github.service.ts
    github.types.ts
  repositories/
    repository-analyzer.service.ts
    repository-filter.service.ts
    repository.types.ts
  health/
    health.service.ts
  shared/
    env.server.ts
    errors.ts
    result.ts
```

Server functions live in:

```text
src/lib/api/github.functions.ts
```

## Current Limitations

- No AI is implemented yet.
- No database is implemented yet.
- Repository analysis currently uses repository metadata and file paths only.
- File content parsing is prepared at the service level but is not used for full-code analysis yet.
- Some existing dashboard, diagrams, commits, endpoint and file-tree UI sections still use temporary mock data.
- GitHub API rate limits apply when `GITHUB_TOKEN` is not configured.

## Next Phases

- Database persistence for imported repositories and analysis snapshots.
- AI summaries based on real repository content.
- RAG over selected source files.
- Chat with real code context.
- AI-generated README output.
