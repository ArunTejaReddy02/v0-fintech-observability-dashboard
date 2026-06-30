import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prismaInstance: PrismaClient;

if (typeof window === "undefined") {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set.");
  }
  
  const pool = new pg.Pool({ 
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000, // Increased timeout for Neon connections
    ssl: {
      rejectUnauthorized: false, // Required for Neon SSL connection in node pg
    },
  });
  const adapter = new PrismaPg(pool);
  
  prismaInstance = globalForPrisma.prisma || new PrismaClient({ adapter });
  
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaInstance;
  }
} else {
  prismaInstance = null as any;
}

export const prisma = prismaInstance;
