import { FastifyInstance } from "fastify";
import Fastify from "fastify";
import { registerPlugins } from "../../src/plugins/index.js";
import { afterAll, beforeAll, beforeEach, vi } from "vitest";
import { PrismaClient } from "@prisma/client";

// Mock the entire @prisma/client module
vi.mock("@prisma/client", () => {
  const mockPrismaClient = vi.fn(() => ({
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    // Add any other Prisma models and methods you use in your tests
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    // Add other models as needed
  }));

  return {
    PrismaClient: mockPrismaClient,
  };
});

export function setupTestServer() {
  let app: FastifyInstance;
  let isReady = false;

  beforeAll(async () => {
    app = Fastify({
      logger: false,
    });

    // Register plugins but don't start external services
    await registerPlugins(app);

    // The server is created but not yet ready - we can add routes now
  });

  const getApp = () => app;

  const prepareApp = async () => {
    if (!isReady) {
      await app.ready();
      isReady = true;
    }
    return app;
  };

  afterAll(async () => {
    if (isReady) {
      await app.close();
    }
  });

  beforeEach(async () => {
    // Reset any test state between tests if needed
    vi.clearAllMocks();
  });

  return {
    getApp,
    prepareApp,
  };
}
