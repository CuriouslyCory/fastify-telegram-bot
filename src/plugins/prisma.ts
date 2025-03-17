import { PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";
import { FastifyInstance, FastifyPluginAsync } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export async function registerPrismaPlugin(app: FastifyInstance) {
  app.register(prismaPlugin);
}

const prismaPlugin: FastifyPluginAsync = fp(async (server, options) => {
  const prisma = new PrismaClient();
  await prisma.$connect();
  server.decorate("prisma", prisma);
  server.addHook("onClose", async (server) => {
    await server.prisma.$disconnect();
  });
});
