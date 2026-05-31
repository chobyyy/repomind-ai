import { getServerEnv } from "../shared/env.server";

export function getBackendHealth() {
  const env = getServerEnv();

  return {
    ok: true,
    appEnv: env.APP_ENV,
    githubTokenConfigured: Boolean(env.GITHUB_TOKEN),
  };
}
