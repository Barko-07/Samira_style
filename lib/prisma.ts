import { PrismaClient } from "@prisma/client";

// ─── Safe Prisma initialization ───────────────────────────────────────────────
// Supports both Neon (serverless) and standard PostgreSQL connections.
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
    // Use Neon serverless adapter when available
    if (dbUrl.includes("neon.tech") || dbUrl.includes("neon.db")) {
      const { Pool, neonConfig } = require("@neondatabase/serverless");
      const { PrismaNeon } = require("@prisma/adapter-neon");
      const ws = require("ws");
      neonConfig.webSocketConstructor = ws;
      const pool = new Pool({ connectionString: dbUrl });
      const adapter = new PrismaNeon(pool);
      return new PrismaClient({ adapter } as never);
    }

    // Standard PostgreSQL connection
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
