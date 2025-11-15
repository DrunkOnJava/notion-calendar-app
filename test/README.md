# Test Environment Management

Comprehensive testing infrastructure for the Notion Calendar application with Docker Compose, Testcontainers, and isolated test environments.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Docker Compose Setup](#docker-compose-setup)
- [Testcontainers Setup](#testcontainers-setup)
- [Environment Variables](#environment-variables)
- [Usage Examples](#usage-examples)
- [Troubleshooting](#troubleshooting)

## Overview

This test environment provides:

- **Isolated Testing**: Complete test environment separate from development
- **Multiple Databases**: PostgreSQL, MongoDB, Redis for comprehensive testing
- **AWS Mocking**: LocalStack for S3, SQS, DynamoDB testing
- **Email Testing**: Mailhog for SMTP testing
- **Object Storage**: MinIO for S3-compatible storage testing
- **Two Approaches**: Docker Compose (recommended) or Testcontainers (programmatic)

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Test Environment

```bash
# Start all services
pnpm test:env:up

# Check status
pnpm test:env:status

# View logs
pnpm test:env:logs
```

### 3. Run Tests

```bash
# Run Playwright tests
pnpm test:e2e

# Run with UI
pnpm test:e2e:ui

# Debug mode
pnpm test:e2e:debug
```

### 4. Stop Test Environment

```bash
# Stop (preserve data)
pnpm test:env:down

# Stop and clean all data
pnpm test:env:clean
```

## Architecture

### Services

| Service    | Port       | Purpose               | Credentials                               |
| ---------- | ---------- | --------------------- | ----------------------------------------- |
| PostgreSQL | 5433       | Relational database   | `test_user` / `test_pass_123`             |
| Redis      | 6380       | Cache & sessions      | Password: `test_redis_pass`               |
| MongoDB    | 27018      | NoSQL database        | `test_user` / `test_pass_123`             |
| LocalStack | 4566       | AWS services mock     | `test` / `test`                           |
| MinIO      | 9000, 9001 | S3-compatible storage | `test_minio_user` / `test_minio_pass_123` |
| Mailhog    | 1025, 8025 | Email testing         | No auth required                          |

### Network

All services run in an isolated Docker network: `notion-calendar-test-network`

### Volumes

Data persists in named volumes:

- `notion-calendar-postgres-test-data`
- `notion-calendar-redis-test-data`
- `notion-calendar-mongodb-test-data`
- `notion-calendar-localstack-data`
- `notion-calendar-minio-data`
- `notion-calendar-mailhog-data`

## Docker Compose Setup

### Configuration

The main configuration is in `docker-compose.test.yml` at the project root.

### Commands

```bash
# Start all services
pnpm test:env:up

# Start specific services
bash scripts/test-env-up.sh postgres-test redis-test

# Stop services
pnpm test:env:down

# Stop and remove volumes (clean slate)
pnpm test:env:clean

# Restart services
pnpm test:env:restart

# Check status
pnpm test:env:status

# View logs (follow mode)
pnpm test:env:logs

# View logs for specific service
docker compose -f docker-compose.test.yml logs -f postgres-test
```

### Health Checks

All services include health checks:

```bash
# Check health status
docker compose -f docker-compose.test.yml ps

# Inspect specific service health
docker inspect notion-calendar-postgres-test --format='{{.State.Health.Status}}'
```

## Testcontainers Setup

For programmatic container management in tests.

### Installation

Dependencies are already included in `package.json`:

```json
{
  "devDependencies": {
    "testcontainers": "^11.7.0"
  }
}
```

### Usage in Tests

```typescript
import { getTestEnvironment } from './test/utils/testcontainers'

describe('Database Tests', () => {
  let env: TestEnvironment

  beforeAll(async () => {
    env = getTestEnvironment()

    // Start PostgreSQL container
    await env.startPostgres('test_db', 'test_user', 'test_pass')

    // Get connection string
    const dbUrl = env.getConnectionString('postgres', 'postgres')
    process.env.DATABASE_URL = dbUrl
  })

  afterAll(async () => {
    // Cleanup all containers
    await env.cleanup()
  })

  test('should connect to database', async () => {
    // Your test code here
  })
})
```

### Available Methods

```typescript
// Start specific containers
await env.startPostgres(database, username, password)
await env.startRedis(password)
await env.startMongoDB(database, username, password)
await env.startLocalStack(services)

// Get connection details
const url = env.getConnectionString('postgres', 'postgres')

// Check status
const isRunning = env.isRunning('postgres')
const count = env.getRunningCount()

// Stop specific container
await env.stopContainer('postgres')

// Stop all containers
await env.cleanup()
```

### Custom Containers

```typescript
await env.startContainer('my-service', {
  image: 'my-image:latest',
  ports: [8080, 9090],
  env: {
    MY_VAR: 'value',
  },
  waitStrategy: 'log',
  waitMessage: '.*Server started.*',
})
```

## Environment Variables

### Test Environment (.env.test)

```bash
# Application
NODE_ENV=test
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Databases
TEST_DATABASE_URL=postgresql://test_user:test_pass_123@localhost:5433/notion_calendar_test
TEST_REDIS_URL=redis://:test_redis_pass@localhost:6380
TEST_MONGODB_URL=mongodb://test_user:test_pass_123@localhost:27018/notion_calendar_test

# Object Storage
TEST_MINIO_ENDPOINT=localhost:9000
TEST_MINIO_ACCESS_KEY=test_minio_user
TEST_MINIO_SECRET_KEY=test_minio_pass_123

# AWS Mock
TEST_AWS_ENDPOINT=http://localhost:4566
TEST_AWS_REGION=us-east-1
TEST_AWS_ACCESS_KEY_ID=test
TEST_AWS_SECRET_ACCESS_KEY=test

# Email
TEST_SMTP_HOST=localhost
TEST_SMTP_PORT=1025

# Testcontainers
USE_TESTCONTAINERS=false  # Set to 'true' for programmatic containers
```

### Loading in Tests

Environment variables are automatically loaded via:

```bash
dotenv -e .env.test -- playwright test
```

Or in your test setup:

```typescript
import { config } from 'dotenv'
config({ path: '.env.test' })
```

## Usage Examples

### Example 1: PostgreSQL Integration Test

```typescript
import { Pool } from 'pg'

describe('User Repository', () => {
  let pool: Pool

  beforeAll(async () => {
    pool = new Pool({
      connectionString: process.env.TEST_DATABASE_URL,
    })
  })

  afterAll(async () => {
    await pool.end()
  })

  test('should create user', async () => {
    const result = await pool.query(
      'INSERT INTO test_users (email, name) VALUES ($1, $2) RETURNING *',
      ['test@example.com', 'Test User']
    )

    expect(result.rows[0]).toHaveProperty('id')
    expect(result.rows[0].email).toBe('test@example.com')
  })
})
```

### Example 2: Redis Cache Test

```typescript
import { createClient } from 'redis'

describe('Cache Service', () => {
  let redis: ReturnType<typeof createClient>

  beforeAll(async () => {
    redis = createClient({
      url: process.env.TEST_REDIS_URL,
    })
    await redis.connect()
  })

  afterAll(async () => {
    await redis.disconnect()
  })

  test('should cache data', async () => {
    await redis.set('test-key', 'test-value', { EX: 60 })
    const value = await redis.get('test-key')
    expect(value).toBe('test-value')
  })
})
```

### Example 3: S3 Mock with LocalStack

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

describe('File Upload Service', () => {
  let s3: S3Client

  beforeAll(() => {
    s3 = new S3Client({
      endpoint: process.env.TEST_AWS_ENDPOINT,
      region: process.env.TEST_AWS_REGION,
      credentials: {
        accessKeyId: process.env.TEST_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.TEST_AWS_SECRET_ACCESS_KEY!,
      },
      forcePathStyle: true,
    })
  })

  test('should upload file to S3', async () => {
    const command = new PutObjectCommand({
      Bucket: 'test-bucket',
      Key: 'test-file.txt',
      Body: 'test content',
    })

    const result = await s3.send(command)
    expect(result.$metadata.httpStatusCode).toBe(200)
  })
})
```

### Example 4: Email Testing with Mailhog

```typescript
import nodemailer from 'nodemailer'
import fetch from 'node-fetch'

describe('Email Service', () => {
  let transporter: nodemailer.Transporter

  beforeAll(() => {
    transporter = nodemailer.createTransport({
      host: process.env.TEST_SMTP_HOST,
      port: parseInt(process.env.TEST_SMTP_PORT!),
      secure: false,
    })
  })

  test('should send email', async () => {
    await transporter.sendMail({
      from: 'test@example.com',
      to: 'recipient@example.com',
      subject: 'Test Email',
      text: 'This is a test',
    })

    // Verify email was received in Mailhog
    const response = await fetch('http://localhost:8025/api/v2/messages')
    const messages = await response.json()

    expect(messages.items.length).toBeGreaterThan(0)
    expect(messages.items[0].Content.Headers.Subject[0]).toBe('Test Email')
  })
})
```

## Troubleshooting

### Services Won't Start

```bash
# Check if ports are already in use
lsof -i :5433 -i :6380 -i :27018 -i :4566 -i :9000 -i :8025

# Check Docker daemon
docker info

# View service logs
pnpm test:env:logs
```

### Containers Are Unhealthy

```bash
# Check specific service logs
docker compose -f docker-compose.test.yml logs postgres-test

# Inspect container
docker inspect notion-calendar-postgres-test

# Restart specific service
docker compose -f docker-compose.test.yml restart postgres-test
```

### Data Persistence Issues

```bash
# List volumes
docker volume ls | grep notion-calendar

# Inspect volume
docker volume inspect notion-calendar-postgres-test-data

# Clean start (remove all data)
pnpm test:env:clean
pnpm test:env:up
```

### Connection Refused Errors

1. Ensure services are running: `pnpm test:env:status`
2. Check health status: `docker compose -f docker-compose.test.yml ps`
3. Verify environment variables in `.env.test`
4. Wait for services to become healthy (30-60 seconds)

### Testcontainers Issues

```bash
# Set debug logging
export DEBUG=testcontainers*

# Increase timeout
export TESTCONTAINERS_WAIT_STRATEGY_TIMEOUT=90000

# Use Docker Compose instead
export USE_TESTCONTAINERS=false
```

## Best Practices

1. **Always use isolated test environment** - Never test against development or production databases
2. **Clean state between test runs** - Use `pnpm test:env:clean` for fresh start
3. **Use transactions in database tests** - Rollback after each test for isolation
4. **Check service health** - Wait for health checks before running tests
5. **Monitor resource usage** - Stop services when not in use
6. **Use fixtures** - Load test data from `test/fixtures/` directories
7. **Set timeouts appropriately** - Allow time for containers to start

## Advanced Configuration

### Custom Docker Compose File

Create `docker-compose.test.override.yml` to customize:

```yaml
version: '3.8'
services:
  postgres-test:
    environment:
      POSTGRES_MAX_CONNECTIONS: 200
    ports:
      - '5434:5432' # Custom port
```

### Test-Specific Initialization

Add SQL scripts to `test/fixtures/db-init/` to run on PostgreSQL startup:

```sql
-- 02-seed-data.sql
INSERT INTO test_users (email, name) VALUES
  ('user1@test.com', 'User 1'),
  ('user2@test.com', 'User 2');
```

### Playwright Global Setup

Already configured in `test/setup/global-setup.ts`:

```typescript
// Update playwright.config.ts
export default defineConfig({
  globalSetup: require.resolve('./test/setup/global-setup.ts'),
  globalTeardown: require.resolve('./test/setup/global-teardown.ts'),
})
```

## Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Testcontainers Documentation](https://testcontainers.com/)
- [Playwright Documentation](https://playwright.dev/)
- [LocalStack Documentation](https://docs.localstack.cloud/)
- [MinIO Documentation](https://min.io/docs/)
- [Mailhog GitHub](https://github.com/mailhog/MailHog)
