import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock LangChain model classes
vi.mock("@langchain/google-genai", () => ({
  ChatGoogleGenerativeAI: vi.fn().mockImplementation((config) => ({
    _config: config,
    modelType: "google",
  })),
}));

vi.mock("@langchain/ollama", () => ({
  ChatOllama: vi.fn().mockImplementation((config) => ({
    _config: config,
    modelType: "ollama",
  })),
}));

// Mock loadEnv module to control environment variables
vi.mock("../../../src/utils/loadEnv", () => ({
  env: {
    GEMINI_API_KEY: "test-gemini-api-key",
  },
}));

// Import model classes for type checking
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOllama } from "@langchain/ollama";

describe("AI Models utility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize all models with correct configurations", async () => {
    // Import the module under test
    const { models } = await import("../../../src/utils/ai-models");

    // Verify all models are exported
    expect(models).toHaveProperty("geminiToolsModel");
    expect(models).toHaveProperty("geminiReasoningModel");
    expect(models).toHaveProperty("deepseekR1");
    expect(models).toHaveProperty("openThinker");

    // Verify model configurations
    const geminiTools = models.geminiToolsModel as any;
    expect(geminiTools._config).toEqual({
      apiKey: "test-gemini-api-key",
      modelName: "gemini-2.0-flash-exp",
      maxConcurrency: 5,
      temperature: 0,
    });

    const geminiReasoning = models.geminiReasoningModel as any;
    expect(geminiReasoning._config).toEqual({
      apiKey: "test-gemini-api-key",
      modelName: "gemini-2.0-flash-thinking-exp-01-21",
      maxConcurrency: 5,
    });

    const deepseekR1 = models.deepseekR1 as any;
    expect(deepseekR1._config).toEqual({
      model: "deepseek-r1:14b",
    });

    const openThinker = models.openThinker as any;
    expect(openThinker._config).toEqual({
      model: "openthinker:latest",
    });
  });
});
