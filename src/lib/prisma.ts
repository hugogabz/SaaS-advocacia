import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient | undefined;
}

export function getPrisma() {
  if (!globalThis.cachedPrisma) {
    const adapter = new PrismaPg(process.env.DATABASE_URL ?? "");
    globalThis.cachedPrisma = new PrismaClient({ adapter });
  }

  return globalThis.cachedPrisma;
}
