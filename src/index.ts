// ESM
import Fastify, { FastifyInstance } from "fastify";
import { registerPlugins } from "./plugins";
import { setupServices } from "./services";
import log from "electron-log";
import { env } from "./utils/loadEnv";

/**
 * Create and configure the Fastify app
 */
export async function createApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: "info",
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss.l",
        },
      },
    },
    trustProxy: true,
  });

  await registerPlugins(app);
  // registerRoutes(app);
  await setupServices(app);

  return app;
}

/**
 * Start the server
 */
export async function startServer(): Promise<void> {
  try {
    const app = await createApp();
    await app.listen({ host: "127.0.0.1", port: Number(env.PORT ?? 3200) });
  } catch (err) {
    log.error(err);
    process.exit(1);
  }
}

// Only start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}
