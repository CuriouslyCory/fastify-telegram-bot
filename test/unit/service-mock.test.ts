import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";

// Example service schema using Zod
const UserResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
});

type UserResponse = z.infer<typeof UserResponseSchema>;

// Mocked database client
const mockDbClient = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};

// Example service that uses the DB client
class UserService {
  constructor(private db: typeof mockDbClient) {}

  async getUserById(id: string): Promise<UserResponse | null> {
    const user = await this.db.user.findUnique({
      where: { id },
    });

    return user;
  }

  async createUser(data: {
    name: string;
    email: string;
  }): Promise<UserResponse> {
    const user = await this.db.user.create({
      data: {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      },
    });

    return user;
  }
}

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();

    // Create a fresh instance of the service with mocked dependencies
    userService = new UserService(mockDbClient);
  });

  describe("getUserById", () => {
    it("should return a user when found", async () => {
      // Setup mock return value
      const mockUser: UserResponse = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "Test User",
        email: "test@example.com",
        createdAt: "2023-01-01T00:00:00.000Z",
      };

      mockDbClient.user.findUnique.mockResolvedValue(mockUser);

      // Call the service method
      const result = await userService.getUserById(mockUser.id);

      // Assertions
      expect(mockDbClient.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(result).toEqual(mockUser);

      // Verify the result passes schema validation
      const validationResult = UserResponseSchema.safeParse(result);
      expect(validationResult.success).toBe(true);
    });

    it("should return null when user not found", async () => {
      // Setup mock to return null
      mockDbClient.user.findUnique.mockResolvedValue(null);

      // Call the service method
      const result = await userService.getUserById("non-existent-id");

      // Assertions
      expect(mockDbClient.user.findUnique).toHaveBeenCalledWith({
        where: { id: "non-existent-id" },
      });
      expect(result).toBeNull();
    });
  });

  describe("createUser", () => {
    it("should create and return a new user", async () => {
      // Setup test data
      const userData = {
        name: "New User",
        email: "new@example.com",
      };

      const createdUser: UserResponse = {
        ...userData,
        id: "123e4567-e89b-12d3-a456-426614174000",
        createdAt: "2023-01-01T00:00:00.000Z",
      };

      // Setup mock to return the created user
      mockDbClient.user.create.mockImplementation(({ data }) => {
        return Promise.resolve({
          ...data,
          id: createdUser.id,
          createdAt: createdUser.createdAt,
        });
      });

      // Call the service method
      const result = await userService.createUser(userData);

      // Assertions
      expect(mockDbClient.user.create).toHaveBeenCalled();
      expect(result).toMatchObject({
        ...userData,
        id: expect.any(String),
        createdAt: expect.any(String),
      });

      // Verify the result passes schema validation
      const validationResult = UserResponseSchema.safeParse(result);
      expect(validationResult.success).toBe(true);
    });
  });
});
