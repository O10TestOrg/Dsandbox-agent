export const ERROR_CODES = [
  "UNAUTHORIZED",
  "FORBIDDEN",
  "NOT_FOUND",
  "PLAN_REQUIRED",
  "LIMIT_REACHED",
  "VALIDATION",
  "RATE_LIMITED",
  "INTERNAL",
] as const;
export type ErrorCode = (typeof ERROR_CODES)[number];

/** HTTP status for each code. PLAN_REQUIRED is 402. */
export const ERROR_STATUS: Record<ErrorCode, number> = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  PLAN_REQUIRED: 402,
  LIMIT_REACHED: 403,
  VALIDATION: 400,
  RATE_LIMITED: 429,
  INTERNAL: 500,
};

export interface ApiError {
  error: { code: ErrorCode; message: string };
}
