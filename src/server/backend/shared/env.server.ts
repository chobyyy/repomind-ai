import process from "node:process";
import { z } from "zod";

const envSchema = z.object({
  GITHUB_TOKEN: z.string().min(1).optional(),
  APP_ENV: z.string().default("development"),
  PUBLIC_APP_URL: z.string().url().optional(),
});

export type ServerEnv = z.infer<typeof envSchema>;

export function getServerEnv(): ServerEnv {
  const parsed = envSchema.safeParse({
    GITHUB_TOKEN: process.env.GITHUB_TOKEN || undefined,
    APP_ENV: process.env.APP_ENV || process.env.NODE_ENV || "development",
    PUBLIC_APP_URL: process.env.PUBLIC_APP_URL || undefined,
  });

  if (!parsed.success) {
    throw new Error(`Invalid server environment: ${parsed.error.message}`);
  }

  return parsed.data;
}
