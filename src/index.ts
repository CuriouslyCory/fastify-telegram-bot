// ESM
import Fastify from "fastify";
import { registerPlugins } from "./plugins";
// import { registerRoutes } from "./routes";
import { setupServices } from "./services";
import log from "electron-log";
import { env } from "./utils/loadEnv";

/**
 * Run the server!
 */
const start = async () => {
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

  try {
    await registerPlugins(app);
    // registerRoutes(app);
    await setupServices(app);

    await app.listen({ host: "127.0.0.1", port: Number(env.PORT ?? 3200) });
  } catch (err) {
    log.error(err);
    process.exit(1);
  }
};
start();
