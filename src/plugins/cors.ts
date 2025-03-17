import { FastifyInstance } from "fastify";
import fastifyCorsPlugin from "@fastify/cors";

const ALLOWED_ORIGINS = ["http://localhost:3000", "localhost:3200"];

export async function registerCorsPlugin(app: FastifyInstance) {
  app.register(fastifyCorsPlugin, {
    origin: ALLOWED_ORIGINS,
  });
}
