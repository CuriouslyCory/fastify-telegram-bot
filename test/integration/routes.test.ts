import { describe, it, expect, beforeAll } from "vitest";
import { setupTestServer } from "../utils/setup-server.js";
import supertest from "supertest";

describe("API Routes", () => {
  const { getApp, prepareApp } = setupTestServer();

  // Add test routes before the server is ready
  beforeAll(async () => {
    // Register a health check route for testing
    getApp().get("/health", async (request, reply) => {
      return { status: "ok" };
    });

    // Setup test routes with parameters
    getApp().get("/test/:id", async (request, reply) => {
      const { id } = request.params as { id: string };
      return { id };
    });

    // Setup test POST route
    getApp().post("/test/user", async (request, reply) => {
      const body = request.body as any;
      return {
        success: true,
        user: body,
      };
    });

    // Now prepare the app (calls app.ready())
    await prepareApp();
  });

  describe("Health check", () => {
    it("should return 200 on health check endpoint", async () => {
      const response = await supertest(getApp().server)
        .get("/health")
        .expect(200);

      expect(response.body).toHaveProperty("status", "ok");
    });
  });

  // Example of testing a route with parameters
  describe("Example route with params", () => {
    it("should handle route parameters correctly", async () => {
      const testId = "123";

      const response = await supertest(getApp().server)
        .get(`/test/${testId}`)
        .expect(200);

      expect(response.body).toEqual({ id: testId });
    });
  });

  // Example of testing a POST route
  describe("Example POST endpoint", () => {
    it("should handle JSON payload correctly", async () => {
      const testPayload = { name: "Test User", email: "test@example.com" };

      const response = await supertest(getApp().server)
        .post("/test/user")
        .send(testPayload)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        user: testPayload,
      });
    });
  });
});
