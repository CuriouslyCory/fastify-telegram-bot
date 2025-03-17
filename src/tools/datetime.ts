import { RunnableToolLike } from "@langchain/core/runnables";
import { StructuredToolInterface, tool } from "@langchain/core/tools";
import { z } from "zod";

// tool that returns the current date and time
export const currentDateTimeTool = tool(
  async () => {
    return new Date().toISOString();
  },
  {
    name: "get_current_date_time",
    description: "Get the current date and time",
    schema: z.object({}),
  }
);

// tool that returns the current date
export const currentDateTool = tool(
  async () => {
    return new Date().toISOString().split("T")[0];
  },
  {
    name: "get_current_date",
    description: "Get the current date",
    schema: z.object({}),
  }
);

// tool that returns the current time
export const currentTimeTool = tool(
  async () => {
    return new Date().toISOString().split("T")[1];
  },
  {
    name: "get_current_time",
    description: "Get the current time",
    schema: z.object({}),
  }
);

export const dateTimeTools = [
  currentDateTimeTool,
  currentDateTool,
  currentTimeTool,
] as (StructuredToolInterface | RunnableToolLike)[];
