import { FastifyInstance } from "fastify";
import { TelegramService } from "./telegram";
import log from "electron-log";

export async function setupServices(app: FastifyInstance) {
  const telegramService = TelegramService.getInstance();

  // Set up the Fastify app in the services for event handling
  telegramService.setApp(app);

  app.addHook("onReady", async () => {
    telegramService.start();
    log.info("Telegram Service started");
  });
}

export { TelegramService };
