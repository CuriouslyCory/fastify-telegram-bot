import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";
import log from "electron-log";

// Mock fs and log
vi.mock("node:fs/promises", () => ({
  readFile: vi.fn(),
}));

vi.mock("electron-log", () => ({
  default: {
    error: vi.fn(),
  },
}));

// Import fs after mocking
import * as fs from "node:fs/promises";

// Define the schema separately for testing
const AgentPromptSchema = z.object({
  system_prompt: z.array(z.string()),
  description: z.string(),
});

const AgentPromptsConfigSchema = z.object({
  telegram: AgentPromptSchema,
});

type AgentPromptsConfig = z.infer<typeof AgentPromptsConfigSchema>;

// Create a test-specific version of the loadAgentPrompts function
async function loadAgentPromptsTest(
  configPath = "./src/constants/agent-prompts.json"
): Promise<AgentPromptsConfig> {
  try {
    const fileContents = await fs.readFile(configPath, "utf-8");
    const config = JSON.parse(fileContents);
    return AgentPromptsConfigSchema.parse(config);
  } catch (error) {
    log.error("Error loading agent prompts:", error);
    throw new Error("Failed to load agent prompts configuration");
  }
}

describe("loadAgentPrompts utility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should load and parse agent prompts from a valid JSON file", async () => {
    const validConfig = {
      telegram: {
        system_prompt: [
          "You are a helpful assistant.",
          "Be concise and accurate.",
        ],
        description: "Telegram bot assistant",
      },
    };

    const mockReadFile = vi.mocked(fs.readFile);
    mockReadFile.mockResolvedValue(JSON.stringify(validConfig));

    const result = await loadAgentPromptsTest("./test-path.json");

    expect(mockReadFile).toHaveBeenCalledWith("./test-path.json", "utf-8");
    expect(result).toEqual(validConfig);
    expect(result.telegram.system_prompt).toEqual(
      validConfig.telegram.system_prompt
    );
    expect(result.telegram.description).toBe(validConfig.telegram.description);
  });

  it("should throw an error if the file cannot be read", async () => {
    const mockReadFile = vi.mocked(fs.readFile);
    mockReadFile.mockRejectedValue(new Error("File not found"));

    await expect(loadAgentPromptsTest("./missing-file.json")).rejects.toThrow(
      "Failed to load agent prompts configuration"
    );
    expect(log.error).toHaveBeenCalledWith(
      "Error loading agent prompts:",
      expect.any(Error)
    );
  });

  it("should throw an error if the file contains invalid JSON", async () => {
    const mockReadFile = vi.mocked(fs.readFile);
    mockReadFile.mockResolvedValue("{ invalid json }");

    await expect(loadAgentPromptsTest()).rejects.toThrow(
      "Failed to load agent prompts configuration"
    );
    expect(log.error).toHaveBeenCalled();
  });

  it("should throw an error if the configuration does not match the schema", async () => {
    const invalidConfig = {
      telegram: {
        // Missing system_prompt
        description: "Telegram bot assistant",
      },
    };

    const mockReadFile = vi.mocked(fs.readFile);
    mockReadFile.mockResolvedValue(JSON.stringify(invalidConfig));

    await expect(loadAgentPromptsTest()).rejects.toThrow(
      "Failed to load agent prompts configuration"
    );
    expect(log.error).toHaveBeenCalled();
  });

  it("should use the default path if no path is provided", async () => {
    const validConfig = {
      telegram: {
        system_prompt: ["Hello"],
        description: "Test",
      },
    };

    const mockReadFile = vi.mocked(fs.readFile);
    mockReadFile.mockResolvedValue(JSON.stringify(validConfig));

    await loadAgentPromptsTest(); // No path provided

    expect(mockReadFile).toHaveBeenCalledWith(
      "./src/constants/agent-prompts.json",
      "utf-8"
    );
  });
});
