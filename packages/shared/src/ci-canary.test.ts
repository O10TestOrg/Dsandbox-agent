import { expect, it } from "vitest";

// Throwaway: proves CI turns red on a failing test. Reverted in the next commit.
it("fails on purpose", () => {
  expect(1).toBe(2);
});
