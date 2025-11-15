#!/bin/bash
# Comprehensive build script with detailed logging

set -e  # Exit on error

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Notion Calendar - Verbose Build Process              ║${NC}"
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo ""

# Step 1: Environment Info
echo -e "${YELLOW}[1/7]${NC} ${GREEN}Environment Information${NC}"
echo "  Node version: $(node --version)"
echo "  pnpm version: $(pnpm --version)"
echo "  Next.js version: $(pnpm list next --depth=0 2>/dev/null | grep next | awk '{print $2}')"
echo "  TypeScript version: $(pnpm list typescript --depth=0 2>/dev/null | grep typescript | awk '{print $2}')"
echo "  Working directory: $(pwd)"
echo ""

# Step 2: Clean previous builds
echo -e "${YELLOW}[2/7]${NC} ${GREEN}Cleaning previous builds${NC}"
if [ -d ".next" ]; then
  echo "  Removing .next directory..."
  rm -rf .next
  echo "  ✓ Clean complete"
else
  echo "  ✓ No previous build found"
fi
echo ""

# Step 3: Dependency check
echo -e "${YELLOW}[3/7]${NC} ${GREEN}Checking dependencies${NC}"
if [ ! -d "node_modules" ]; then
  echo "  Installing dependencies..."
  pnpm install
else
  echo "  ✓ Dependencies already installed"
fi
echo ""

# Step 4: Type checking with verbose output
echo -e "${YELLOW}[4/7]${NC} ${GREEN}Running TypeScript type check (verbose)${NC}"
echo "  Command: tsc --noEmit --listFiles"
echo ""
if pnpm type-check:verbose 2>&1 | tee /tmp/typecheck.log | tail -20; then
  TYPECHECK_LINES=$(wc -l < /tmp/typecheck.log)
  echo ""
  echo "  ✓ Type check passed ($TYPECHECK_LINES files checked)"
else
  echo ""
  echo -e "  ${RED}✗ Type check failed - see errors above${NC}"
  echo "  Full log: /tmp/typecheck.log"
  exit 1
fi
echo ""

# Step 5: Linting with verbose output
echo -e "${YELLOW}[5/7]${NC} ${GREEN}Running ESLint (verbose)${NC}"
if pnpm lint:verbose 2>&1 | tee /tmp/lint.log; then
  echo "  ✓ Linting passed"
else
  echo -e "  ${YELLOW}⚠ Linting warnings found - see above${NC}"
  echo "  Full log: /tmp/lint.log"
fi
echo ""

# Step 6: Production build with timing
echo -e "${YELLOW}[6/7]${NC} ${GREEN}Building production bundle${NC}"
echo "  Command: next build (with verbose logging)"
echo "  Start time: $(date '+%H:%M:%S')"
echo ""

START_TIME=$(date +%s)

if NODE_OPTIONS='--max-old-space-size=8192' \
   NEXT_TELEMETRY_DEBUG=1 \
   next build --debug 2>&1 | tee /tmp/build.log; then

  END_TIME=$(date +%s)
  DURATION=$((END_TIME - START_TIME))

  echo ""
  echo -e "  ${GREEN}✓ Build succeeded${NC}"
  echo "  End time: $(date '+%H:%M:%S')"
  echo "  Duration: ${DURATION}s"
  echo "  Full log: /tmp/build.log"
else
  END_TIME=$(date +%s)
  DURATION=$((END_TIME - START_TIME))

  echo ""
  echo -e "  ${RED}✗ Build failed after ${DURATION}s${NC}"
  echo "  Full log: /tmp/build.log"
  exit 1
fi
echo ""

# Step 7: Build analysis
echo -e "${YELLOW}[7/7]${NC} ${GREEN}Build Analysis${NC}"
if [ -d ".next" ]; then
  NEXT_SIZE=$(du -sh .next 2>/dev/null | cut -f1)
  STATIC_SIZE=$(du -sh .next/static 2>/dev/null | cut -f1)
  echo "  .next directory size: $NEXT_SIZE"
  echo "  Static assets size: $STATIC_SIZE"

  if [ -f ".next/build-manifest.json" ]; then
    PAGE_COUNT=$(cat .next/build-manifest.json | grep -o '"pages":' | wc -l)
    echo "  Pages built: $PAGE_COUNT"
  fi
fi
echo ""

# Summary
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                  Build Complete ✓                         ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Logs saved to:"
echo "  - Type check: /tmp/typecheck.log"
echo "  - Lint: /tmp/lint.log"
echo "  - Build: /tmp/build.log"
echo ""
