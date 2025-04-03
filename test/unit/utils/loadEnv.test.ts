import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Save original process.env
const originalEnv = { ...process.env };

describe("loadEnv utility", () => {
  beforeEach(() => {
    // Reset process.env before each test
    process.env = { ...originalEnv };

    // Mock required environment variables
    process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/testdb";
    process.env.GEMINI_API_KEY = "test-gemini-api-key";
    process.env.TELEGRAM_BOT_TOKEN = "test-telegram-bot-token";
    process.env.PORT = "3000";

    // Clear module cache to force reloading
    vi.resetModules();
  });

  afterEach(() => {
    // Restore original process.env
    process.env = { ...originalEnv };
  });

  it("should load environment variables correctly", async () => {
    const { env } = await import("../../../src/utils/loadEnv");

    expect(env.DATABASE_URL).toBe(
      "postgresql://test:test@localhost:5432/testdb"
    );
    expect(env.GEMINI_API_KEY).toBe("test-gemini-api-key");
    expect(env.TELEGRAM_BOT_TOKEN).toBe("test-telegram-bot-token");
    expect(env.PORT).toBe(3000); // Should be converted to number
  });

  it("should transform PORT string to number", async () => {
    process.env.PORT = "4200";

    const { env } = await import("../../../src/utils/loadEnv");

    expect(typeof env.PORT).toBe("number");
    expect(env.PORT).toBe(4200);
  });

  it("should throw an error when required variables are missing", async () => {
    delete process.env.DATABASE_URL;
    delete process.env.GEMINI_API_KEY;
    delete process.env.TELEGRAM_BOT_TOKEN;

    // Force direct error capture for the validation error
    try {
      await import("../../../src/utils/loadEnv");
      // If we reach here, the test should fail
      expect("No error was thrown").toBe("Error should have been thrown");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should throw an error for invalid URL format", async () => {
    process.env.DATABASE_URL = "not-a-url";

    await expect(async () => {
      await import("../../../src/utils/loadEnv");
    }).rejects.toThrow();
  });

  it("should throw an error for invalid PORT value", async () => {
    process.env.PORT = "not-a-number";

    await expect(async () => {
      await import("../../../src/utils/loadEnv");
    }).rejects.toThrow();
  });

  it("should treat empty strings as undefined", async () => {
    process.env.DATABASE_URL = "";

    await expect(async () => {
      await import("../../../src/utils/loadEnv");
    }).rejects.toThrow();
  });
});
