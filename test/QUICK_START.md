# Test Environment Quick Start

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Test Environment

```bash
pnpm test:env:up
```

Wait 30-60 seconds for all services to become healthy.

### 3. Run Tests

```bash
# Playwright E2E tests
pnpm test:e2e

# Or with UI
pnpm test:e2e:ui
```

## 📋 Essential Commands

| Command | Description |
|---------|-------------|
| `pnpm test:env:up` | Start all test services |
| `pnpm test:env:down` | Stop test services (keep data) |
| `pnpm test:env:clean` | Stop and delete all test data |
| `pnpm test:env:status` | Check service health |
| `pnpm test:env:logs` | View live logs |
| `pnpm test:env:restart` | Restart all services |
| `pnpm test:e2e` | Run Playwright tests |
| `pnpm test:e2e:ui` | Run tests with Playwright UI |
| `pnpm test:e2e:debug` | Debug tests step-by-step |

## 🔌 Service Endpoints

After running `pnpm test:env:up`:

| Service | Endpoint | Purpose |
|---------|----------|---------|
| PostgreSQL | `localhost:5433` | Test database |
| Redis | `localhost:6380` | Cache/sessions |
| MongoDB | `localhost:27018` | NoSQL data |
| MinIO Console | `http://localhost:9001` | S3 storage UI |
| Mailhog UI | `http://localhost:8025` | Email testing UI |
| LocalStack | `http://localhost:4566` | AWS services |

## 🔑 Test Credentials

**PostgreSQL:**
- Host: `localhost:5433`
- Database: `notion_calendar_test`
- User: `test_user`
- Password: `test_pass_123`

**Redis:**
- Host: `localhost:6380`
- Password: `test_redis_pass`

**MongoDB:**
- Host: `localhost:27018`
- Database: `notion_calendar_test`
- User: `test_user`
- Password: `test_pass_123`

**MinIO:**
- Endpoint: `localhost:9000`
- Console: `http://localhost:9001`
- Access Key: `test_minio_user`
- Secret Key: `test_minio_pass_123`

**AWS (LocalStack):**
- Endpoint: `http://localhost:4566`
- Access Key: `test`
- Secret Key: `test`
- Region: `us-east-1`

## 🔍 Quick Checks

### Check if services are running:

```bash
pnpm test:env:status
```

### View logs for debugging:

```bash
# All services
pnpm test:env:logs

# Specific service
docker compose -f docker-compose.test.yml logs -f postgres-test
```

### Connect to databases:

```bash
# PostgreSQL
PGPASSWORD=test_pass_123 psql -h localhost -p 5433 -U test_user -d notion_calendar_test

# Redis
redis-cli -h localhost -p 6380 -a test_redis_pass

# MongoDB
mongosh "mongodb://test_user:test_pass_123@localhost:27018/notion_calendar_test"
```

## 🧹 Cleanup

### Stop services (preserve data):

```bash
pnpm test:env:down
```

### Fresh start (delete all test data):

```bash
pnpm test:env:clean
pnpm test:env:up
```

## ⚠️ Troubleshooting

### Services won't start?

```bash
# Check what's using the ports
lsof -i :5433 -i :6380 -i :27018

# Check Docker
docker ps
docker compose -f docker-compose.test.yml ps
```

### Tests failing?

1. Ensure services are healthy: `pnpm test:env:status`
2. Check logs: `pnpm test:env:logs`
3. Try a fresh start: `pnpm test:env:clean && pnpm test:env:up`
4. Wait 60 seconds for services to initialize

### Need to reset everything?

```bash
# Nuclear option - removes all test containers and data
docker compose -f docker-compose.test.yml down -v
pnpm test:env:up
```

## 📚 More Information

For detailed documentation, see [test/README.md](./README.md)

## 🎯 Next Steps

1. ✅ Start test environment: `pnpm test:env:up`
2. ✅ Verify health: `pnpm test:env:status`
3. ✅ Run tests: `pnpm test:e2e`
4. 📖 Read full docs: `test/README.md`
5. 🛠️ Write your tests in `e2e/` directory
