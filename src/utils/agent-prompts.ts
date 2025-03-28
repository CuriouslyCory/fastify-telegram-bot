import { z } from "zod";
import fs from "node:fs/promises";
import path from "node:path";
import log from "electron-log";

const AgentPromptSchema = z.object({
  system_prompt: z.array(z.string()),
  description: z.string(),
});

const AgentPromptsConfigSchema = z.object({
  telegram: AgentPromptSchema,
});

type AgentPromptsConfig = z.infer<typeof AgentPromptsConfigSchema>;

export async function loadAgentPrompts(
  configPath: string = "./src/constants/agent-prompts.json"
): Promise<AgentPromptsConfig> {
  try {
    const fileContents = await fs.readFile(path.resolve(configPath), "utf-8");
    const config = JSON.parse(fileContents);
    return AgentPromptsConfigSchema.parse(config);
  } catch (error) {
    log.error("Error loading agent prompts:", error);
    throw new Error("Failed to load agent prompts configuration");
  }
}
