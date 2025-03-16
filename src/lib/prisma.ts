// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// This prevents database connections during build time
const prismaClientSingleton = () => {
  // Only create PrismaClient during runtime, not build time
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    // Return a mock client during build
    return {} as PrismaClient;
  }
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const db = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
