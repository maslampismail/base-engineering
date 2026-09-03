import { PrismaClient } from '@prisma/client';

let prisma;

function createPrismaClient() {
  // Check if running on Cloudflare environment with D1 binding
  if (typeof process !== 'undefined' && process.env?.valencia_db) {
    try {
      const { PrismaD1 } = require('@prisma/adapter-d1');
      const adapter = new PrismaD1(process.env.valencia_db);
      return new PrismaClient({ adapter });
    } catch (e) {
      console.warn('PrismaD1 adapter initialization skipped, falling back to standard client:', e.message);
    }
  }

  // Local development / Node runtime with SQLite
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

if (process.env.NODE_ENV === 'production') {
  prisma = createPrismaClient();
} else {
  if (!globalThis.prisma) {
    globalThis.prisma = createPrismaClient();
  }
  prisma = globalThis.prisma;
}

export default prisma;
