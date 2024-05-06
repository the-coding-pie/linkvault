import "server-only";

import { PrismaClient } from "@prisma/client";

// for development purpose (to tackle with hotreload in development)
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

declare global {
  var prisma: PrismaClient | undefined;
}
