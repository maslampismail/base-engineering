import { PrismaClient } from '@prisma/client';

let prisma;

function createPrismaClient() {
  // Check if running on Cloudflare environment with D1 binding
  const d1Binding = typeof process !== 'undefined' ? process.env?.base_db : null;
  if (d1Binding) {
    try {
      const { PrismaD1 } = require('@prisma/adapter-d1');
      const adapter = new PrismaD1(d1Binding);
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
