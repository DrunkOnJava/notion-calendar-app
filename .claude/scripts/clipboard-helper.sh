#!/bin/bash
# Simple clipboard-based command paster
# Copies each command to clipboard and waits for you to paste

COMMANDS=(
  "/fix-metadata"
  "/fix-color-system"
  "/refactor-database-card"
  "/setup-environment"
  "/add-error-boundaries"
  "/add-prettier"
  "/setup-github-actions"
)

echo "🎯 Claude Code Command Helper"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "I'll copy each command to your clipboard."
echo "Just press Cmd+V in each Chrome tab!"
echo ""
echo "Press Enter to start..."
read

for i in "${!COMMANDS[@]}"; do
  CMD="${COMMANDS[$i]}"
  NUM=$((i + 1))
  
  # Copy to clipboard
  echo -n "$CMD" | pbcopy
  
  # Notify
  osascript -e "display notification \"Command copied! Paste in tab $NUM\" with title \"$CMD\" sound name \"Pop\""
  
  echo "[$NUM/7] ✅ Copied: $CMD"
  echo "      👉 Now press Cmd+V in Chrome tab $NUM, then press Enter here"
  
  # Wait for user confirmation
  read -p "      " 
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 All 7 commands processed!"
echo ""
echo "📊 Monitor progress:"
echo "   ./.claude/scripts/dashboard.sh"
echo ""

# Send completion notification
osascript -e 'display notification "All commands sent to Chrome tabs!" with title "Task Launch Complete" sound name "Glass"'
