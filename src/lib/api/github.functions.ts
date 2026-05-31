import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { NormalizedRepository } from "@/server/backend/github/github.types";
import type { RepositoryAnalysisSummary } from "@/server/backend/repositories/repository.types";

type ApiSuccess<T> = {
  ok: true;
  data: T;
};

type ApiFailure = {
  ok: false;
  error: {
    code: string;
    message: string;
    status: number;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

async function safeHandler<T>(operation: () => Promise<T>): Promise<ApiResponse<T>> {
  try {
    return {
      ok: true,
      data: await operation(),
    };
  } catch (error) {
    const { toSafeError } = await import("@/server/backend/shared/errors");

    return {
      ok: false,
      error: toSafeError(error),
    };
  }
}

export const getGitHubUserRepositories = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      username: z.string().trim().min(1, "GitHub username is required").max(39),
    }),
  )
  .handler(async ({ data }): Promise<ApiResponse<NormalizedRepository[]>> => {
    return safeHandler(async () => {
      const { getUserRepositories } = await import("@/server/backend/github/github.service");

      return getUserRepositories(data.username);
    });
  });

export const getRepositoryBasicInfo = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      owner: z.string().trim().min(1),
      repo: z.string().trim().min(1),
    }),
  )
  .handler(async ({ data }): Promise<ApiResponse<NormalizedRepository>> => {
    return safeHandler(async () => {
      const { getRepository } = await import("@/server/backend/github/github.service");

      return getRepository(data.owner, data.repo);
    });
  });

export const analyzeRepository = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      repoUrl: z.string().trim().url("Enter a valid GitHub repository URL"),
    }),
  )
  .handler(async ({ data }): Promise<ApiResponse<RepositoryAnalysisSummary>> => {
    return safeHandler(async () => {
      const { analyzeRepositoryFromUrl } =
        await import("@/server/backend/repositories/repository-analyzer.service");

      return analyzeRepositoryFromUrl(data.repoUrl);
    });
  });
