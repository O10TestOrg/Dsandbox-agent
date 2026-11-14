/** Bar fill as a whole percent of the limit, from 0 to 100. Over the limit (or a limit of 0 or less with any use) fills the bar. */
export function usagePercent(used: number, limit: number): number {
  if (!Number.isFinite(used) || used <= 0) return 0;
  if (!Number.isFinite(limit) || limit <= 0) return 100;
  return Math.min(100, Math.round((used / limit) * 100));
}
