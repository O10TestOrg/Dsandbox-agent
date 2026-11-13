import { z } from "zod";

/** POST /api/billing/checkout. No input; the server knows the user and the price. */
export const checkoutRequestSchema = z.object({}).strict();
export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
export interface CheckoutResponse {
  url: string;
}

/** POST /api/billing/portal */
export const portalRequestSchema = z.object({}).strict();
export type PortalRequest = z.infer<typeof portalRequestSchema>;
export interface PortalResponse {
  url: string;
}
