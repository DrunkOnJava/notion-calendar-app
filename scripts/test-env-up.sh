#!/bin/bash
# Start test environment using Docker Compose
# Usage: ./scripts/test-env-up.sh [service...]

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting test environment...${NC}"

# Load environment variables
if [ -f .env.test ]; then
  echo -e "${GREEN}✓ Loading .env.test${NC}"
  export $(cat .env.test | grep -v '^#' | xargs)
fi

# Check if docker-compose is available
if ! command -v docker &> /dev/null; then
  echo -e "${RED}✗ Docker is not installed or not in PATH${NC}"
  exit 1
fi

# Start services
if [ $# -eq 0 ]; then
  echo -e "${BLUE}Starting all test services...${NC}"
  docker compose -f docker-compose.test.yml up -d
else
  echo -e "${BLUE}Starting services: $@${NC}"
  docker compose -f docker-compose.test.yml up -d "$@"
fi

echo ""
echo -e "${GREEN}✓ Test environment started successfully!${NC}"
echo ""
echo -e "${YELLOW}Services:${NC}"
echo "  PostgreSQL:  localhost:5433"
echo "  Redis:       localhost:6380"
echo "  MongoDB:     localhost:27018"
echo "  LocalStack:  localhost:4566"
echo "  MinIO:       localhost:9000 (Console: 9001)"
echo "  Mailhog:     localhost:8025 (SMTP: 1025)"
echo ""
echo -e "${YELLOW}Commands:${NC}"
echo "  View logs:       docker compose -f docker-compose.test.yml logs -f"
echo "  Stop services:   pnpm test:env:down"
echo "  Restart:         pnpm test:env:restart"
echo ""
