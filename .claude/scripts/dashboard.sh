#!/bin/bash
# Real-time dashboard for Claude Code tasks

REPO="DrunkOnJava/notion-calendar-app"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Progress bar
show_progress_bar() {
  local completed=$1
  local total=$2
  local width=50
  local percentage=$((completed * 100 / total))
  local filled=$((completed * width / total))
  local empty=$((width - filled))

  printf "  ["
  printf "%${filled}s" | tr ' ' '█'
  printf "%${empty}s" | tr ' ' '░'
  printf "] ${percentage}%% (${completed}/${total})\n"
}

# Main dashboard
while true; do
  clear

  echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${CYAN}║        Claude Code on the Web - Live Dashboard                ║${NC}"
  echo -e "${CYAN}║        Repository: ${REPO}           ║${NC}"
  echo -e "${CYAN}║        Updated: $(date '+%H:%M:%S')                                        ║${NC}"
  echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
  echo ""

  # Count statuses
  TOTAL_TASKS=8
  MERGED=0
  OPEN_PRS=0
  WORKING=0
  PENDING=0

  # Expected branches
  BRANCHES=(
    "fix/critical-configuration"
    "docs/update-metadata"
    "fix/color-contrast"
    "refactor/database-card-styles"
    "chore/environment-setup"
    "feat/error-boundaries"
    "chore/prettier-setup"
    "ci/github-actions"
  )

  for branch in "${BRANCHES[@]}"; do
    if gh api repos/${REPO}/pulls?state=all\&head=DrunkOnJava:${branch} --jq '.[0].merged_at' 2>/dev/null | grep -q "T"; then
      ((MERGED++))
    elif gh pr list --repo ${REPO} --head ${branch} &>/dev/null && [ "$(gh pr list --repo ${REPO} --head ${branch} --json number --jq 'length')" -gt 0 ]; then
      ((OPEN_PRS++))
    elif gh api repos/${REPO}/branches/${branch} &>/dev/null; then
      ((WORKING++))
    else
      ((PENDING++))
    fi
  done

  # Overall progress
  echo -e "${BLUE}Overall Progress:${NC}"
  show_progress_bar $MERGED $TOTAL_TASKS
  echo ""

  # Status breakdown
  echo -e "${BLUE}Status Breakdown:${NC}"
  echo -e "  ${GREEN}✓ Merged:${NC}        ${MERGED}/${TOTAL_TASKS}"
  echo -e "  ${CYAN}📝 Pull Requests:${NC} ${OPEN_PRS}"
  echo -e "  ${PURPLE}🔨 Working:${NC}       ${WORKING}"
  echo -e "  ${YELLOW}⏳ Pending:${NC}       ${PENDING}"
  echo ""

  # Recent PRs
  echo -e "${BLUE}Recent Pull Requests:${NC}"
  gh pr list --repo ${REPO} --limit 3 --json number,title,state,createdAt --jq '.[] | "  #\(.number) [\(.state)] \(.title)\n    Created: \(.createdAt | split("T")[0])"' 2>/dev/null || echo "  No PRs yet"
  echo ""

  # Active branches
  echo -e "${BLUE}Active Task Branches:${NC}"
  gh api repos/${REPO}/branches --jq '.[] | select(.name | test("^(fix|feat|docs|refactor|chore|ci)/")) | "  • \(.name)"' 2>/dev/null | head -5 || echo "  No active branches"
  echo ""

  echo -e "${YELLOW}Press Ctrl+C to exit${NC}"

  sleep 10
done
