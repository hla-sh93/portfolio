import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  try {
    // Prisma 7 requires a driver adapter — pg against DATABASE_URL
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL missing");
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    return new PrismaClient({ adapter });
  } catch {
    // If PrismaClient fails to initialize (e.g. no DATABASE_URL),
    // return a proxy that throws helpful errors on use
    return new Proxy({} as PrismaClient, {
      get(_target, prop) {
        if (prop === "then" || prop === Symbol.toPrimitive) return undefined;
        throw new Error(
          `Database is not configured. Set DATABASE_URL in .env to use ${String(prop)}.`
        );
      },
    });
  }
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
