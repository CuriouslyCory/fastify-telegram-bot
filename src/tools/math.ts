import { tool } from "@langchain/core/tools";
import { z } from "zod";

// Tool for llm to do math, takes an array of numbers and returns the sum
export const additionTool = tool(
  async ({ numbers }) => {
    return numbers.reduce((a, b) => a + b, 0);
  },
  {
    name: "addition_tool",
    description: "Add two or more numbers",
    schema: z.object({
      numbers: z.array(z.number()).describe("Array of numbers to add together"),
    }),
  }
);

// tool for llm to subtract two or more numbers
export const subtractionTool = tool(
  async ({ numbers }) => {
    if (numbers.length === 1) {
      return numbers[0];
    }
    const firstNumber = numbers.shift();
    if (!firstNumber) {
      return "No numbers provided";
    }
    return numbers.reduce((a, b) => a - b, firstNumber);
  },
  {
    name: "subtraction_tool",
    description: "Subtract two or more numbers",
    schema: z.object({
      numbers: z.array(z.number()).describe("Array of numbers to subtract"),
    }),
  }
);

// tool for llm to multiply two numbers
export const multiplicationTool = tool(
  async ({ a, b }) => {
    return a * b;
  },
  {
    name: "multiplication_tool",
    description: "Multiply two numbers",
    schema: z.object({
      a: z.number().describe("The first number to multiply"),
      b: z.number().describe("The second number to multiply"),
    }),
  }
);

// tool for llm to divide two numbers
export const divisionTool = tool(
  async ({ a, b }) => {
    return a / b;
  },
  {
    name: "division_tool",
    description: "Divide two numbers",
    schema: z.object({
      a: z.number().describe("The first number to divide"),
      b: z.number().describe("The second number to divide"),
    }),
  }
);
