export type AppErrorCode =
  | "BAD_REQUEST"
  | "GITHUB_RATE_LIMITED"
  | "GITHUB_NOT_FOUND"
  | "GITHUB_HTTP_ERROR"
  | "GITHUB_INVALID_RESPONSE"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status: number;

  constructor(code: AppErrorCode, message: string, status = 500) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
  }
}

export function toSafeError(error: unknown) {
  if (error instanceof AppError) {
    return {
      code: error.code,
      message: error.message,
      status: error.status,
    };
  }

  return {
    code: "INTERNAL_ERROR" as const,
    message: "Something went wrong while processing the request.",
    status: 500,
  };
}
