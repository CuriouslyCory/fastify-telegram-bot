import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { StructuredToolInterface } from "@langchain/core/tools";
import { RunnableToolLike } from "@langchain/core/runnables";
import { SystemMessage } from "@langchain/core/messages";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import log from "electron-log";

import { getCheckpointer } from "./checkpointer";
import { models } from "../utils/ai-models";
import { stringLengthTool } from "../tools/strings";
import { mathTools } from "../tools";
import { loadAgentPrompts } from "../utils/agent-prompts";
import path from "node:path";

export async function getTelegramAgent() {
  log.info("Getting telegram agent");
  const client = MultiServerMCPClient.fromConfigFile(
    "./src/constants/mcp.json"
  );
  await client.initializeConnections();
  const tools = client.getTools();

  const pgCheckpointSaver = await getCheckpointer();
  pgCheckpointSaver.setup();

  const selectedModel = models.geminiToolsModel;

  if (!selectedModel) {
    log.error("No suitable model found for telegram agent");
    throw new Error("No suitable model found for telegram agent");
  }

  // Load agent prompts configuration
  const agentPrompts = await loadAgentPrompts();
  const systemPrompt = agentPrompts.telegram.system_prompt.join("\n");

  // Create the agent with all tools
  const telegramAgent = createReactAgent({
    llm: selectedModel,
    tools: [
      ...(Array.isArray(mathTools) ? mathTools : [mathTools]),
      stringLengthTool,
      ...tools,
    ] as (StructuredToolInterface | RunnableToolLike)[],
    checkpointSaver: pgCheckpointSaver,
    stateModifier: new SystemMessage(systemPrompt),
  });

  return telegramAgent;
}

// Function to handle Telegram messages
export async function handleTelegramMessage(
  message: string,
  userId?: number,
  chatId?: number
) {
  try {
    const telegramAgent = await getTelegramAgent();
    const result = await telegramAgent.invoke(
      {
        messages: [
          {
            role: "user",
            content: [
              "<Context>",
              `- The current date and time is ${new Date().toLocaleString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                }
              )}`,
              `- Chat ID: ${chatId}`,
              `- User ID: ${userId}`,
              "</Context>",
              `<UserMessage>${message}</UserMessage>`,
            ].join("\n"),
          },
        ],
      },
      {
        configurable: {
          thread_id: `${userId}-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`,
          user_id: userId,
          chatId,
        },
      }
    );

    return (
      result.messages.at(-1)?.content.toString() ?? "No response generated"
    );
  } catch (error) {
    log.error("Error handling telegram message:", error);
    throw error;
  }
}
