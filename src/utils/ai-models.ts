import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOllama } from "@langchain/ollama";
import { env } from "./loadEnv";

// Initialize models
const geminiToolsModelRaw = new ChatGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY,
  modelName: "gemini-2.0-flash-exp",
  maxConcurrency: 5,
  temperature: 0,
});

const geminiReasoningModelRaw = new ChatGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY,
  modelName: "gemini-2.0-flash-thinking-exp-01-21",
  maxConcurrency: 5,
});

const deepseekR1Raw = new ChatOllama({
  model: "deepseek-r1:14b",
});

const openThinkerRaw = new ChatOllama({
  model: "openthinker:latest",
});

export const models = {
  geminiToolsModel: geminiToolsModelRaw,
  geminiReasoningModel: geminiReasoningModelRaw,
  deepseekR1: deepseekR1Raw,
  openThinker: openThinkerRaw,
};
