import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { TelegramService } from "~/services/telegram";
import log from "electron-log";

// Tool to send telegram responses
export const respondToTelegram = tool(
  async ({ chatId, message }) => {
    log.info("Sending telegram message", { chatId });
    try {
      const telegramService = TelegramService.getInstance();
      await telegramService.sendMessage(chatId, message);
      return `Message successfully sent to user`;
    } catch (error) {
      return `Failed to send telegram message: ${error instanceof Error ? error.message : "Unknown error"}`;
    }
  },
  {
    name: "respond_to_telegram",
    description: [
      "Send a response message to a telegram chat.",
      `Allowed entities:`,
      `For example the following HTML/Markdown aliases for message entities can be used:`,
      "",
      `messageEntityBold => <b>bold</b>, <strong>bold</strong>, **bold**`,
      `messageEntityItalic => <i>italic</i>, <em>italic</em> *italic*`,
      `messageEntityCode » => <code>code</code>, \`code\``,
      `messageEntityStrike => <s>strike</s>, <strike>strike</strike>, <del>strike</del>, ~~strike~~`,
      `messageEntityUnderline => <u>underline</u>`,
      `messageEntityPre » => <pre language="c++">code</pre>,`,
      `\`\`\`c++`,
      `code`,
      `\`\`\``,
      `The following entities can also be used to mention users:`,
      "",
      `inputMessageEntityMentionName => Mention a user`,
      `messageEntityMention => @botfather (this mention is generated automatically server-side for @usernames in messages)`,
    ].join("\n"),
    schema: z.object({
      chatId: z
        .number()
        .describe("The telegram chat ID to send the message to"),
      message: z
        .string()
        .max(4096)
        .describe(
          "The message content to send. Maximum message length is 4096 characters."
        ),
    }),
  }
);
