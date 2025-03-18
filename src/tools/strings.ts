import { tool } from "@langchain/core/tools";
import { z } from "zod";
import log from "electron-log";

// Tool to execute document workflows
export const stringLengthTool = tool(
  async ({ string }) => {
    log.info("calculating string length");
    return string.length;
  },
  {
    name: "string_length",
    description: "Check the length of a string",
    schema: z.object({
      string: z.string().describe("The string to get the length of"),
    }),
  }
);
