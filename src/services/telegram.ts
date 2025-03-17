import { FastifyInstance } from "fastify";
import { Telegraf, Types } from "telegraf";
import log from "electron-log";
import { message } from "telegraf/filters";
import { handleTelegramMessage } from "../agents/telegram-agent";
import { splitMessage } from "~/utils/message-splitter";
import { env } from "~/utils/loadEnv";

export class TelegramService {
  private bot: Telegraf; // https://telegraf.js.org/classes/Telegram.html
  private static instance: TelegramService;
  private app?: FastifyInstance;

  private constructor() {
    this.bot = new Telegraf(env.TELEGRAM_BOT_TOKEN);
    this.setupHandlers();
  }

  public setApp(app: FastifyInstance) {
    this.app = app;
  }

  public static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

  private setupHandlers() {
    // Handle start command
    this.bot.command("start", async (ctx) => {
      log.info("Received start command from", ctx.from);
      await ctx.reply(
        "Welcome! I'm here to help you analyze executive orders and other documents. Send me a text or file to get started."
      );
    });

    // Handle help command
    this.bot.command("help", async (ctx) => {
      await ctx.reply(
        "Available commands:\n" +
          "/start - Start the bot\n" +
          "/help - Show this help message\n\n" +
          "You can also:\n" +
          "- Send me a URL to add it to the research database\n" +
          "- Ask me to analyze a document by title or ID\n" +
          "- Request an ELI5 or action plan for a document\n" +
          "- Ask me to update a document's score"
      );
    });

    // Handle text messages
    this.bot.on(message("text"), async (ctx) => {
      log.info("Received message:", ctx.message.text);
      try {
        await ctx.reply("Processing your request...");

        const response = await handleTelegramMessage(
          ctx.message.text,
          ctx.from?.id,
          ctx.message.chat.id
        );
        if (response.toLowerCase() !== "okay") {
          await this.sendMessage(ctx.message.chat.id, response);
        }
      } catch (error) {
        log.error("Error processing message:", error);
        await ctx.reply(
          "Sorry, I encountered an error processing your message."
        );
      }
    });

    // Handle document/file messages
    this.bot.on(message("document"), async (ctx) => {
      const doc = ctx.message.document;
      const userId = ctx.from?.id;

      await ctx.reply("Documents not supported at this time.");
      return;
    });

    // Handle errors
    this.bot.catch((err: unknown) => {
      if (err instanceof Error) {
        log.error("Telegram bot error:", err);
      } else {
        log.error("Telegram bot error:", err);
      }
    });
  }

  private async sendChunkedMessage(
    chatId: number,
    message: string,
    options: Types.ExtraReplyMessage = {}
  ) {
    const MAX_LENGTH = 3500; // Slightly shorter to accommodate markdown
    const chunks = splitMessage(message, MAX_LENGTH);

    log.info("Sending chunked message:", chunks);

    // Send chunks with part numbers for long messages
    const usePartNumbers = chunks.length > 1;
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const messageText = usePartNumbers
        ? `Part ${i + 1}/${chunks.length}\n\n${chunk}`
        : chunk;
      await this.bot.telegram.sendMessage(chatId, messageText, {
        ...options,
        parse_mode: "HTML",
      });
    }
  }

  public async sendMessage(
    chatId: number,
    message: string,
    replyToMessageId?: number
  ) {
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (message.length > 4096) {
          await this.sendChunkedMessage(chatId, message, {
            reply_to: replyToMessageId,
            parse_mode: "HTML",
          } as Types.ExtraReplyMessage);
          return;
        }

        await this.bot.telegram.sendMessage(chatId, message, {
          reply_to: replyToMessageId,
          parse_mode: "HTML",
        } as Types.ExtraReplyMessage);
        return;
      } catch (error) {
        const isLastAttempt = attempt === maxRetries;

        if (error instanceof Error) {
          log.error(
            `Error sending message (attempt ${attempt}/${maxRetries}):`,
            {
              error: error.message,
              stack: error.stack,
              chatId,
              messageLength: message.length,
            }
          );
        } else {
          log.error(
            `Unknown error sending message (attempt ${attempt}/${maxRetries}):`,
            error
          );
        }

        if (isLastAttempt) {
          throw error;
        } else {
          const delay =
            baseDelay * Math.pow(2, attempt - 1) * (0.5 + Math.random());
          log.info(`Retrying in ${Math.round(delay)}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
  }

  public async start() {
    try {
      await this.bot.launch();
      log.info("Telegram bot started");

      // Enable graceful stop
      process.once("SIGINT", () => this.bot.stop("SIGINT"));
      process.once("SIGTERM", () => this.bot.stop("SIGTERM"));
    } catch (error) {
      log.error("Error starting bot:", error);
      throw error;
    }
  }

  public async stop() {
    await this.bot.stop();
    log.info("Telegram bot stopped");
  }
}
