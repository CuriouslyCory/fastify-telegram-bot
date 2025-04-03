import { describe, it, expect, vi, beforeEach } from "vitest";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import log from "electron-log";
import pg from "pg";

// Use inline functions in mocks to avoid hoisting issues
vi.mock("pg", () => ({
  default: {
    Pool: vi.fn(() => ({
      connect: vi.fn(),
      end: vi.fn(),
      query: vi.fn(),
    })),
  },
}));

vi.mock("@langchain/langgraph-checkpoint-postgres", () => ({
  PostgresSaver: vi.fn(() => ({
    setup: vi.fn(),
  })),
}));

vi.mock("electron-log", () => ({
  default: {
    error: vi.fn(),
  },
}));

// Mock process.env directly with a getter/setter
let databaseUrl: string | undefined =
  "postgresql://test:test@localhost:5432/testdb";
vi.mock("process", () => ({
  env: {
    get DATABASE_URL() {
      return databaseUrl;
    },
  },
}));

// Import the module under test after mocks
import { getCheckpointer } from "../../../src/agents/checkpointer";

describe("Checkpointer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    databaseUrl = "postgresql://test:test@localhost:5432/testdb";
  });

  it("should create a PostgresSaver with the correct configuration", async () => {
    // Call the function under test
    const checkpointer = await getCheckpointer();

    // Verify that Pool was constructed with correct config
    expect(pg.Pool).toHaveBeenCalledWith({
      connectionString: "postgresql://test:test@localhost:5432/testdb",
      max: 20,
      idleTimeoutMillis: 1000,
      connectionTimeoutMillis: 1000,
      maxUses: 7500,
    });

    // Verify that PostgresSaver was constructed with a pool instance
    expect(PostgresSaver).toHaveBeenCalled();

    // Verify the function returned the PostgresSaver instance
    expect(checkpointer).toBeDefined();
  });

  it("should handle errors when setting up the checkpointer", async () => {
    // Setup pg.Pool to throw an error
    const testError = new Error("Connection error");
    vi.mocked(pg.Pool).mockImplementationOnce(() => {
      throw testError;
    });

    // Call the function and expect it to throw
    await expect(getCheckpointer()).rejects.toThrow("Connection error");

    // Verify the error was logged
    expect(log.error).toHaveBeenCalledWith(
      "Error getting checkpointer",
      testError
    );
  });

  it("should accept a falsy DATABASE_URL value", async () => {
    // Set DATABASE_URL to undefined
    databaseUrl = undefined;

    // Call the function
    await getCheckpointer();

    // Verify Pool was called with connectionString: undefined
    expect(pg.Pool).toHaveBeenCalledWith(
      expect.objectContaining({
        connectionString: undefined,
      })
    );
  });
});
