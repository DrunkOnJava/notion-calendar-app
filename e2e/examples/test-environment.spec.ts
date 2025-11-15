/**
 * Example test demonstrating test environment usage
 * This test shows how to use the test environment services
 */

import { test, expect } from '@playwright/test';

test.describe('Test Environment Examples', () => {
  test('should have test environment variables configured', async () => {
    // Verify environment variables are set from global setup
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.TEST_DATABASE_URL).toBeDefined();
    expect(process.env.TEST_REDIS_URL).toBeDefined();
  });

  test('should be able to navigate to the application', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');

    // Verify page loads
    await expect(page).toHaveTitle(/Notion Calendar/i);
  });

  test('should have access to test services', async () => {
    // This is just a demonstration - in real tests you would:
    // 1. Use DATABASE_URL to connect to PostgreSQL
    // 2. Use REDIS_URL to connect to Redis
    // 3. Use AWS endpoint for LocalStack
    // 4. Use MinIO for file uploads
    // 5. Use Mailhog for email verification

    // Example connection URLs from environment
    const dbUrl = process.env.TEST_DATABASE_URL;
    const redisUrl = process.env.TEST_REDIS_URL;
    const awsEndpoint = process.env.TEST_AWS_ENDPOINT;

    expect(dbUrl).toContain('localhost:5433');
    expect(redisUrl).toContain('localhost:6380');
    expect(awsEndpoint).toContain('localhost:4566');
  });
});
