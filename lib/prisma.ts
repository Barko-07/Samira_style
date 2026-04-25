import { PrismaClient } from "@prisma/client";

// ─── Safe Prisma initialization (Prisma 7) ────────────────────────────────────
// Prisma 7 da adapter va url konfiguratsiyasi prisma.config.ts orqali beriladi.
// Bu yerda oddiy PrismaClient yaratamiz.

const globalForPrisma = global as unknown as { prisma: PrismaClient | null };

function createPrismaClient(): PrismaClient | null {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.warn("[prisma] DATABASE_URL is not set — using fallback data.");
    return null;
  }

  try {
    return new PrismaClient();
  } catch (err) {
    console.error("[prisma] Failed to initialize Prisma client:", err);
    return null;
  }
}

export const prisma: PrismaClient =
  (globalForPrisma.prisma ??
    createPrismaClient()) as unknown as PrismaClient;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

