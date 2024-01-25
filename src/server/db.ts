import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { Client } from "@planetscale/database";
import { PrismaPlanetScale } from "@prisma/adapter-planetscale";
import { PrismaClient } from "@prisma/client";

import { env } from "~/env.js";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const client = new Client({ url: env.DATABASE_URL });

type PrismaAdapter = {
  new (client: Client): PrismaPlanetScale;
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    adapter: new PrismaPlanetScale(client) as PrismaAdapter,  
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
