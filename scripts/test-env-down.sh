#!/bin/bash
# Stop test environment and optionally clean up volumes
# Usage: ./scripts/test-env-down.sh [--clean]

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

CLEAN=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --clean)
      CLEAN=true
      shift
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      echo "Usage: $0 [--clean]"
      exit 1
      ;;
  esac
done

echo -e "${BLUE}🛑 Stopping test environment...${NC}"

# Stop services
docker compose -f docker-compose.test.yml down

if [ "$CLEAN" = true ]; then
  echo -e "${YELLOW}🧹 Cleaning up volumes...${NC}"
  docker compose -f docker-compose.test.yml down -v
  echo -e "${GREEN}✓ Volumes removed${NC}"
fi

echo ""
echo -e "${GREEN}✓ Test environment stopped successfully!${NC}"
echo ""

if [ "$CLEAN" = false ]; then
  echo -e "${YELLOW}Note: Data volumes are preserved${NC}"
  echo "Run with --clean to remove all test data: pnpm test:env:clean"
fi
