# Testing Guide

This project uses Vitest for unit and integration testing, and Playwright for end-to-end testing.

## Running Tests

```bash
# Run all tests once
pnpm test

# Run tests in watch mode (for development)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage

# Run end-to-end tests
pnpm test:e2e
```

## Test Structure

- `test/unit/`: Unit tests for individual functions and components
- `test/integration/`: Integration tests for API routes and service interactions
- `test/e2e/`: End-to-end tests with Playwright
- `test/utils/`: Test utilities and helpers

## Database and Environment Setup

### Mocking Prisma

The test environment automatically mocks Prisma to avoid the need for a real database connection during tests. The mock is set up in `test/utils/setup-server.ts`.

If you need to add additional Prisma models or methods to the mock, update the mock object:

```typescript
vi.mock("@prisma/client", () => {
  const mockPrismaClient = vi.fn(() => ({
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    // Add your models here
    yourModel: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      // etc.
    },
  }));
  
  return {
    PrismaClient: mockPrismaClient,
  };
});
```

### Environment Variables

Tests use a separate set of environment variables defined in:
1. `test/.env.test` file
2. Environment variables in `vitest.config.ts`
3. Variables set programmatically in `test/setup.ts`

To add additional environment variables required for your tests, update these files.

## Writing Tests

### Unit Tests

Unit tests verify that individual functions work correctly in isolation. Example:

```typescript
import { describe, it, expect } from 'vitest';

describe('myFunction', () => {
  it('should return expected result', () => {
    const result = myFunction(input);
    expect(result).toBe(expectedValue);
  });
});
```

### Integration Tests

Integration tests verify that multiple components work together correctly. We use `supertest` to test HTTP endpoints:

```typescript
import { describe, it, expect } from 'vitest';
import { setupTestServer } from '../utils/setup-server.js';
import supertest from 'supertest';

describe('API Routes', () => {
  const { getApp, prepareApp } = setupTestServer();
  
  // Register routes before calling prepareApp
  beforeAll(async () => {
    // Add your test routes here
    getApp().get('/your-route', handler);
    
    // Then prepare the app
    await prepareApp();
  });
  
  it('should return correct response', async () => {
    const response = await supertest(getApp().server)
      .get('/your-route')
      .expect(200);
    
    expect(response.body).toEqual(expectedResponse);
  });
});
```

### Mocking

For testing services with external dependencies, use Vitest's mocking capabilities:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Create mocks
const mockDependency = {
  method: vi.fn()
};

// Reset mocks before each test
beforeEach(() => {
  vi.resetAllMocks();
});

// Configure mock behavior
mockDependency.method.mockResolvedValue(expectedValue);

// Assert mock was called correctly
expect(mockDependency.method).toHaveBeenCalledWith(expectedArgs);
```

## Best Practices

1. **Test in isolation**: Mock external dependencies to test only the unit under test
2. **Test edge cases**: Include tests for error conditions and boundary values
3. **Use descriptive test names**: Test names should describe the expected behavior
4. **Ensure schema validation**: Use Zod schemas to validate test data and responses
5. **Keep tests independent**: Tests should not depend on each other's state
6. **Run tests before committing**: Ensure all tests pass before pushing code

## Improving Coverage

Current code coverage is low. To improve it:

1. Write tests for more components and features
2. Focus on critical paths in your application
3. Run `pnpm test:coverage` to identify areas that need more tests
4. Aim for meaningful tests rather than 100% coverage 