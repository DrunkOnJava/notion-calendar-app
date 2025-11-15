/**
 * Global test setup for Playwright and other test frameworks
 * Initializes test environment and containers before test execution
 */

import { getTestEnvironment } from '../utils/testcontainers';

async function globalSetup() {
  console.log('🚀 Starting test environment setup...');

  const env = getTestEnvironment();

  try {
    // Start containers based on environment variables or config
    const useContainers = process.env.USE_TESTCONTAINERS === 'true';

    if (useContainers) {
      console.log('📦 Starting Testcontainers...');

      // Start PostgreSQL
      const postgres = await env.startPostgres();
      const pgPort = postgres.getMappedPort(5432);
      const pgHost = postgres.getHost();
      process.env.TEST_DATABASE_URL = `postgresql://test_user:test_pass@${pgHost}:${pgPort}/test_db`;
      console.log(`✅ PostgreSQL started on ${pgHost}:${pgPort}`);

      // Start Redis
      const redis = await env.startRedis('test_pass');
      const redisPort = redis.getMappedPort(6379);
      const redisHost = redis.getHost();
      process.env.TEST_REDIS_URL = `redis://:test_pass@${redisHost}:${redisPort}`;
      console.log(`✅ Redis started on ${redisHost}:${redisPort}`);

      console.log('✅ All containers started successfully');
    } else {
      console.log('📝 Using Docker Compose environment');
      // Set environment variables for Docker Compose setup
      process.env.TEST_DATABASE_URL =
        process.env.TEST_DATABASE_URL ||
        'postgresql://test_user:test_pass_123@localhost:5433/notion_calendar_test';
      process.env.TEST_REDIS_URL =
        process.env.TEST_REDIS_URL || 'redis://:test_redis_pass@localhost:6380';
      process.env.TEST_MONGODB_URL =
        process.env.TEST_MONGODB_URL ||
        'mongodb://test_user:test_pass_123@localhost:27018/notion_calendar_test';
      process.env.TEST_MINIO_ENDPOINT = process.env.TEST_MINIO_ENDPOINT || 'localhost:9000';
      process.env.TEST_MINIO_ACCESS_KEY =
        process.env.TEST_MINIO_ACCESS_KEY || 'test_minio_user';
      process.env.TEST_MINIO_SECRET_KEY =
        process.env.TEST_MINIO_SECRET_KEY || 'test_minio_pass_123';
    }

    // Set common test environment variables
    // Note: NODE_ENV is read-only and should be set by the test runner
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3001';

    console.log('✅ Test environment setup completed');
  } catch (error) {
    console.error('❌ Failed to setup test environment:', error);
    throw error;
  }
}

export default globalSetup;
