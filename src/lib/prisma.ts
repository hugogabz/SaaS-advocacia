import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient | undefined;
}

export function getPrisma() {
  if (!globalThis.cachedPrisma) {
    globalThis.cachedPrisma = new PrismaClient();
  }

  return globalThis.cachedPrisma;
}
