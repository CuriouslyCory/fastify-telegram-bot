import { ToolNode } from "@langchain/langgraph/prebuilt";
import { StructuredToolInterface } from "@langchain/core/tools";
import { RunnableToolLike } from "@langchain/core/runnables";
import {
  additionTool,
  divisionTool,
  multiplicationTool,
  subtractionTool,
} from "./math";
import { stringLengthTool } from "./strings";

export type Tool = ToolNode | StructuredToolInterface | RunnableToolLike;
export type Tools = ToolNode | (StructuredToolInterface | RunnableToolLike)[];

export const mathTools: Tools = [
  additionTool,
  subtractionTool,
  multiplicationTool,
  divisionTool,
];

export const stringTools: Tools = [stringLengthTool];
