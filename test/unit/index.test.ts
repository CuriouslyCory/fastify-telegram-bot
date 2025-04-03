import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Fastify from "fastify";
import * as plugins from "../../src/plugins";
import * as services from "../../src/services";
import log from "electron-log";
import { createApp, startServer } from "../../src/index";

// Create a module-scoped variable to control env for tests
const mockEnv: { PORT: string | undefined } = { PORT: "3200" };

// Mock dependencies
vi.mock("fastify", () => {
  const mockListen = vi.fn().mockResolvedValue(undefined);
  const mockRegister = vi.fn();
  const mockClose = vi.fn().mockResolvedValue(undefined);
  const mockDecorate = vi.fn();
  const mockReady = vi.fn().mockResolvedValue(undefined);

  const mockApp = {
    register: mockRegister,
    listen: mockListen,
    close: mockClose,
    decorate: mockDecorate,
    ready: mockReady,
  };

  return {
    default: vi.fn(() => mockApp),
  };
});

vi.mock("../../src/plugins", () => ({
  registerPlugins: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../../src/services", () => ({
  setupServices: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("electron-log", () => ({
  default: {
    error: vi.fn(),
  },
}));

// Mock env with a module that returns our controlled mockEnv variable
vi.mock("../../src/utils/loadEnv", () => ({
  get env() {
    return mockEnv;
  },
}));

describe("App Initialization", () => {
  let originalProcessExit: typeof process.exit;

  beforeEach(() => {
    // Save original process.exit
    originalProcessExit = process.exit;
    // Mock process.exit
    process.exit = vi.fn() as any;

    // Reset env.PORT for each test
    mockEnv.PORT = "3200";

    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original process.exit
    process.exit = originalProcessExit;
  });

  describe("createApp", () => {
    it("should initialize the app with correct configuration", async () => {
      // Call the createApp function
      const app = await createApp();

      // Verify Fastify was initialized with the correct config
      expect(Fastify).toHaveBeenCalledWith({
        logger: {
          level: "info",
          transport: {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "HH:MM:ss.l",
            },
          },
        },
        trustProxy: true,
      });

      // Verify plugins were registered
      expect(plugins.registerPlugins).toHaveBeenCalledWith(app);

      // Verify services were set up
      expect(services.setupServices).toHaveBeenCalledWith(app);
    });

    it("should pass through errors from plugin registration", async () => {
      // Make plugins.registerPlugins throw an error
      const testError = new Error("Test plugin error");
      vi.mocked(plugins.registerPlugins).mockRejectedValueOnce(testError);

      // Expect createApp to throw the error
      await expect(createApp()).rejects.toThrow(testError);
    });
  });

  describe("startServer", () => {
    it("should create app and start listening on the specified port", async () => {
      // Call the startServer function
      await startServer();

      // Get the mock Fastify instance
      const fastifyInstance = Fastify();

      // Verify app listen was called with the correct host and port
      expect(fastifyInstance.listen).toHaveBeenCalledWith({
        host: "127.0.0.1",
        port: 3200,
      });
    });

    it("should use default port 3200 if PORT env variable is not set", async () => {
      // Modify the env mock to return undefined for PORT
      mockEnv.PORT = undefined;

      // Call the startServer function
      await startServer();

      // Get the mock Fastify instance
      const fastifyInstance = Fastify();

      // Verify app listen was called with default port 3200
      expect(fastifyInstance.listen).toHaveBeenCalledWith({
        host: "127.0.0.1",
        port: 3200,
      });
    });

    it("should handle errors and exit with code 1", async () => {
      // Make Fastify.listen throw an error
      const testError = new Error("Test listen error");
      const fastifyInstance = Fastify();
      fastifyInstance.listen = vi.fn().mockRejectedValueOnce(testError);

      // Call the startServer function
      await startServer();

      // Verify that log.error was called with the error
      expect(log.error).toHaveBeenCalledWith(testError);

      // Verify that process.exit was called with error code 1
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });
});
