import { describe, it, expect } from "vitest";
import { z } from "zod";

// Example function to test
function addNumbers(a: number, b: number): number {
  return a + b;
}

// Example Zod schema (since you prefer Zod)
const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().optional(),
});

type User = z.infer<typeof UserSchema>;

describe("Unit tests example", () => {
  describe("addNumbers", () => {
    it("should add two positive numbers correctly", () => {
      expect(addNumbers(2, 3)).toBe(5);
    });

    it("should handle negative numbers", () => {
      expect(addNumbers(-1, -2)).toBe(-3);
    });
  });

  describe("Zod schema validation", () => {
    it("should validate a correct user object", () => {
      const validUser = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "Test User",
        email: "test@example.com",
        age: 30,
      };

      const result = UserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it("should reject an invalid user object", () => {
      const invalidUser = {
        id: "not-a-uuid",
        name: "",
        email: "not-an-email",
      };

      const result = UserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });
});
