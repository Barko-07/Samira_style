import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// ─── Safe Prisma initialization ───────────────────────────────────────────────
// Uses pg adapter natively for stable connection pooling.
// If DATABASE_URL is missing, prisma is null — server actions fall back to
// mock data gracefully instead of crashing.

const globalForPrisma = global as unknown as { prisma: PrismaClient | null };

function createPrismaClient(): PrismaClient | null {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.warn("[prisma] DATABASE_URL is not set — using fallback data.");
    return null;
  }

  try {
    const pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
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
