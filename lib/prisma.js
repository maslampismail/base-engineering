import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { getRequestContext } from '@cloudflare/next-on-pages';

const dummyD1 = {
  prepare: () => ({
    bind: () => ({
      all: async () => ({ results: [] }),
      first: async () => null,
      run: async () => ({ success: true }),
      raw: async () => [],
    }),
    all: async () => ({ results: [] }),
    first: async () => null,
    run: async () => ({ success: true }),
    raw: async () => [],
  }),
  batch: async () => [],
  exec: async () => ({ count: 0, duration: 0 }),
};

let nodeClient = null;
let edgeFallbackClient = null;
const clientMap = new WeakMap();

function getD1Binding() {
  try {
    const ctx = getRequestContext();
    if (ctx?.env?.base_db) return ctx.env.base_db;
  } catch {}
  if (typeof process !== 'undefined' && process.env?.base_db) {
    return process.env.base_db;
  }
  return null;
}

function getActiveClient() {
  const isEdge = process.env.NEXT_RUNTIME === 'edge' || typeof EdgeRuntime !== 'undefined';
  const d1 = getD1Binding();

  if (d1) {
    if (typeof d1 === 'object' && d1 !== null) {
      if (!clientMap.has(d1)) {
        const adapter = new PrismaD1(d1);
        clientMap.set(d1, new PrismaClient({ adapter }));
      }
      return clientMap.get(d1);
    }
    const adapter = new PrismaD1(d1);
    return new PrismaClient({ adapter });
  }

  if (isEdge) {
    if (!edgeFallbackClient) {
      const adapter = new PrismaD1(dummyD1);
      edgeFallbackClient = new PrismaClient({ adapter });
    }
    return edgeFallbackClient;
  }

  if (!nodeClient) {
    if (process.env.NODE_ENV === 'development') {
      if (!globalThis.prisma) {
        globalThis.prisma = new PrismaClient({ log: ['error', 'warn'] });
      }
      nodeClient = globalThis.prisma;
    } else {
      nodeClient = new PrismaClient({ log: ['error'] });
    }
  }
  return nodeClient;
}

const prisma = new Proxy({}, {
  get(_target, prop) {
    const client = getActiveClient();
    const val = client[prop];
    if (typeof val === 'function') {
      return val.bind(client);
    }
    return val;
  },
});

export default prisma;
