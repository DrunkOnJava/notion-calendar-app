#!/bin/bash
# Monitor Claude Code on the web tasks in real-time

set -e

REPO="DrunkOnJava/notion-calendar-app"
CHECK_INTERVAL=10  # seconds

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Clear screen and show header
clear
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}   Claude Code on the Web - Task Monitor${NC}"
echo -e "${CYAN}   Repository: ${REPO}${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Expected branches for each task
EXPECTED_BRANCHES=(
  "fix/critical-configuration"
  "docs/update-metadata"
  "fix/color-contrast"
  "refactor/database-card-styles"
  "chore/environment-setup"
  "feat/error-boundaries"
  "chore/prettier-setup"
  "ci/github-actions"
)

# Task names corresponding to branches
TASK_NAMES=(
  "Critical Configuration"
  "Update Metadata"
  "Color Contrast Fix"
  "Database Card Refactor"
  "Environment Setup"
  "Error Boundaries"
  "Prettier Setup"
  "GitHub Actions CI/CD"
)

# Function to check if gh CLI is installed
check_gh_cli() {
  if ! command -v gh &> /dev/null; then
    echo -e "${RED}✗ GitHub CLI (gh) is not installed${NC}"
    echo -e "${YELLOW}  Install with: brew install gh${NC}"
    exit 1
  fi

  # Check if authenticated
  if ! gh auth status &> /dev/null; then
    echo -e "${RED}✗ GitHub CLI is not authenticated${NC}"
    echo -e "${YELLOW}  Run: gh auth login${NC}"
    exit 1
  fi
}

# Function to get branch status
get_branch_status() {
  local branch=$1

  # Check if branch exists remotely
  if gh api repos/${REPO}/branches/${branch} &> /dev/null; then
    echo "exists"
  else
    echo "pending"
  fi
}

# Function to get PR status for a branch
get_pr_status() {
  local branch=$1

  # Get PR number for this branch
  local pr_number=$(gh pr list --repo ${REPO} --head ${branch} --json number --jq '.[0].number' 2>/dev/null)

  if [ -z "$pr_number" ]; then
    echo "no-pr"
    return
  fi

  # Get PR state
  local pr_state=$(gh pr view ${pr_number} --repo ${REPO} --json state --jq '.state' 2>/dev/null)

  case $pr_state in
    OPEN)
      echo "open:$pr_number"
      ;;
    MERGED)
      echo "merged:$pr_number"
      ;;
    CLOSED)
      echo "closed:$pr_number"
      ;;
    *)
      echo "unknown"
      ;;
  esac
}

# Function to display status
display_status() {
  local total=${#EXPECTED_BRANCHES[@]}
  local completed=0
  local in_progress=0
  local pending=0

  echo -e "${BLUE}Task Status Overview:${NC}"
  echo ""

  for i in "${!EXPECTED_BRANCHES[@]}"; do
    local branch="${EXPECTED_BRANCHES[$i]}"
    local task="${TASK_NAMES[$i]}"
    local branch_status=$(get_branch_status "$branch")
    local pr_status=$(get_pr_status "$branch")

    printf "  %-30s " "$task"

    if [ "$branch_status" == "pending" ]; then
      echo -e "${YELLOW}⏳ Pending${NC}"
      ((pending++))
    elif [[ "$pr_status" == merged:* ]]; then
      local pr_num="${pr_status#merged:}"
      echo -e "${GREEN}✓ Merged${NC} ${PURPLE}(#${pr_num})${NC}"
      ((completed++))
    elif [[ "$pr_status" == open:* ]]; then
      local pr_num="${pr_status#open:}"
      echo -e "${CYAN}📝 PR Open${NC} ${PURPLE}(#${pr_num})${NC}"
      ((in_progress++))
    elif [ "$branch_status" == "exists" ]; then
      echo -e "${BLUE}🔨 Working${NC} (branch created)"
      ((in_progress++))
    else
      echo -e "${YELLOW}⏳ Pending${NC}"
      ((pending++))
    fi
  done

  echo ""
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "  ${GREEN}Completed: ${completed}/${total}${NC}  |  ${CYAN}In Progress: ${in_progress}${NC}  |  ${YELLOW}Pending: ${pending}${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Function to show recent activity
show_recent_activity() {
  echo ""
  echo -e "${BLUE}Recent Activity:${NC}"
  echo ""

  # Get recent branches (last 24 hours)
  local recent_branches=$(gh api repos/${REPO}/branches --jq '.[] | select(.name | test("^(fix|feat|docs|refactor|chore|ci)/")) | .name' 2>/dev/null | head -5)

  if [ -n "$recent_branches" ]; then
    while IFS= read -r branch; do
      local commit_msg=$(gh api repos/${REPO}/branches/${branch} --jq '.commit.commit.message' 2>/dev/null | head -1)
      echo -e "  ${PURPLE}→${NC} ${branch}"
      echo -e "    ${commit_msg}" | head -1
    done <<< "$recent_branches"
  else
    echo -e "  ${YELLOW}No recent branches${NC}"
  fi

  echo ""

  # Get recent PRs
  echo -e "${BLUE}Recent Pull Requests:${NC}"
  echo ""

  local recent_prs=$(gh pr list --repo ${REPO} --limit 5 --json number,title,state,headRefName 2>/dev/null)

  if [ -n "$recent_prs" ] && [ "$recent_prs" != "[]" ]; then
    echo "$recent_prs" | jq -r '.[] | "  #\(.number) - \(.title)\n    Branch: \(.headRefName) | State: \(.state)"'
  else
    echo -e "  ${YELLOW}No recent pull requests${NC}"
  fi
}

# Main monitoring loop
main() {
  check_gh_cli

  if [ "$1" == "--once" ]; then
    # Single check mode
    display_status
    show_recent_activity
    exit 0
  fi

  # Continuous monitoring mode
  echo -e "${GREEN}Starting continuous monitoring...${NC}"
  echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
  echo ""
  sleep 2

  while true; do
    clear
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}   Claude Code on the Web - Task Monitor${NC}"
    echo -e "${CYAN}   Repository: ${REPO}${NC}"
    echo -e "${CYAN}   Last Updated: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    display_status
    show_recent_activity

    echo ""
    echo -e "${YELLOW}Refreshing in ${CHECK_INTERVAL} seconds... (Ctrl+C to stop)${NC}"

    sleep ${CHECK_INTERVAL}
  done
}

# Handle Ctrl+C gracefully
trap 'echo -e "\n${GREEN}Monitoring stopped.${NC}"; exit 0' INT

# Run main function
main "$@"
