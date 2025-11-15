#!/bin/bash
# Watch for new PRs and send desktop notifications

REPO="DrunkOnJava/notion-calendar-app"
LAST_PR_COUNT=0

# Get current PR count
get_pr_count() {
  gh pr list --repo ${REPO} --json number --jq 'length' 2>/dev/null || echo "0"
}

# Send notification (macOS)
notify() {
  local title="$1"
  local message="$2"
  osascript -e "display notification \"$message\" with title \"$title\""
}

# Main loop
echo "Watching for new PRs on ${REPO}..."
echo "Press Ctrl+C to stop"

LAST_PR_COUNT=$(get_pr_count)

while true; do
  CURRENT_PR_COUNT=$(get_pr_count)

  if [ "$CURRENT_PR_COUNT" -gt "$LAST_PR_COUNT" ]; then
    # New PR detected
    NEW_PR=$(gh pr list --repo ${REPO} --limit 1 --json number,title --jq '.[0] | "#\(.number): \(.title)"')

    echo "[$(date '+%H:%M:%S')] New PR: $NEW_PR"
    notify "Claude Code Task Complete!" "$NEW_PR"

    LAST_PR_COUNT=$CURRENT_PR_COUNT
  fi

  sleep 30
done
