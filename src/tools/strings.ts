import { tool } from "@langchain/core/tools";
import { z } from "zod";

// Tool to execute document workflows
export const stringLengthTool = tool(
  async ({ string }) => {
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
