#!/bin/bash
# Quick status check for Claude Code tasks

REPO="DrunkOnJava/notion-calendar-app"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${BLUE}Checking task status...${NC}\n"

# Check for new branches
echo -e "${YELLOW}Active Branches:${NC}"
gh api repos/${REPO}/branches --jq '.[] | select(.name | test("^(fix|feat|docs|refactor|chore|ci)/")) | "  • \(.name)"' 2>/dev/null || echo "  None yet"

echo ""

# Check for open PRs
echo -e "${YELLOW}Open Pull Requests:${NC}"
gh pr list --repo ${REPO} --json number,title,headRefName --jq '.[] | "  #\(.number): \(.title)\n    Branch: \(.headRefName)"' 2>/dev/null || echo "  None yet"

echo ""

# Show recent commits on main
echo -e "${YELLOW}Recent Activity on Main:${NC}"
gh api repos/${REPO}/commits?per_page=3 --jq '.[] | "  \(.commit.author.date | split("T")[0]) - \(.commit.message | split("\n")[0])"' 2>/dev/null
