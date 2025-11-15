#!/bin/bash
# Check status of test environment services
# Usage: ./scripts/test-env-status.sh

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📊 Test Environment Status${NC}"
echo ""

# Check if any containers are running
if ! docker compose -f docker-compose.test.yml ps --format json 2>/dev/null | jq -e '. != null' > /dev/null 2>&1; then
  echo -e "${YELLOW}⚠ No test environment containers found${NC}"
  echo "Run: pnpm test:env:up"
  exit 0
fi

# Display container status
echo -e "${YELLOW}Services:${NC}"
docker compose -f docker-compose.test.yml ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo -e "${YELLOW}Health Status:${NC}"

# Check individual service health
services=("postgres-test" "redis-test" "mongodb-test" "localstack" "minio" "mailhog")
service_names=("PostgreSQL" "Redis" "MongoDB" "LocalStack" "MinIO" "Mailhog")

for i in "${!services[@]}"; do
  container="notion-calendar-${services[$i]}"
  name="${service_names[$i]}"

  if docker ps --filter "name=$container" --format "{{.Names}}" | grep -q "$container"; then
    health=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "no-healthcheck")

    if [ "$health" = "healthy" ]; then
      echo -e "  ${GREEN}✓${NC} $name: ${GREEN}Healthy${NC}"
    elif [ "$health" = "no-healthcheck" ]; then
      status=$(docker inspect --format='{{.State.Status}}' "$container")
      if [ "$status" = "running" ]; then
        echo -e "  ${GREEN}✓${NC} $name: ${GREEN}Running${NC}"
      else
        echo -e "  ${RED}✗${NC} $name: ${RED}$status${NC}"
      fi
    else
      echo -e "  ${YELLOW}⚠${NC} $name: ${YELLOW}$health${NC}"
    fi
  else
    echo -e "  ${RED}✗${NC} $name: ${RED}Not running${NC}"
  fi
done

echo ""
echo -e "${YELLOW}Volume Usage:${NC}"
docker volume ls --filter "name=notion-calendar" --format "table {{.Name}}\t{{.Size}}"

echo ""
echo -e "${YELLOW}Network:${NC}"
if docker network ls | grep -q "notion-calendar-test-network"; then
  echo -e "  ${GREEN}✓${NC} Test network active"
else
  echo -e "  ${RED}✗${NC} Test network not found"
fi
