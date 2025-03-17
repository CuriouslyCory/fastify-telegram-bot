import { FastifyInstance } from "fastify";
import { registerCorsPlugin } from "./cors";
import { registerPrismaPlugin } from "./prisma";

export async function registerPlugins(app: FastifyInstance) {
  await registerCorsPlugin(app);
  await registerPrismaPlugin(app);
}
