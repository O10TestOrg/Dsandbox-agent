"use client";

import { createAuthClient } from "better-auth/react";

// No baseURL: the client talks to the same origin, so previews and production just work.
export const authClient = createAuthClient();
