import { beforeAll } from "vitest";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load test environment variables
beforeAll(() => {
  dotenv.config({ path: path.join(__dirname, ".env.test") });

  // Override environment variables dynamically if needed
  process.env.NODE_ENV = "test";

  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL =
      "postgresql://testuser:testpassword@localhost:5432/testdb?schema=test";
  }
});
