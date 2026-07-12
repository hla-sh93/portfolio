import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  try {
    // Prisma 7 reads DATABASE_URL from the environment automatically
    return new PrismaClient();
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
