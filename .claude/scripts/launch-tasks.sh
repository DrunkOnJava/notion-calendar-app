#!/bin/bash
# Master script to launch all Claude Code tasks

echo "🚀 Claude Code Task Launcher"
echo ""

# Check if commands are pushed to GitHub
echo "📋 Verifying setup..."
if ! git log --oneline -1 | grep -q "delegation\|commands"; then
	echo "⚠️  Warning: Commands might not be pushed to GitHub yet"
	echo "   Run: git push origin main"
	read -p "   Continue anyway? (y/n) " -n 1 -r
	echo
	if [[ ! $REPLY =~ ^[Yy]$ ]]; then
		exit 1
	fi
fi

echo "✅ Setup verified"
echo ""

# Run the AppleScript
echo "🤖 Starting automation..."
echo ""
echo "Instructions:"
echo "  1. Make sure Chrome is open with claude.ai/code tabs"
echo "  2. The first tab should be on claude.ai/code"
echo "  3. Browser will activate in 5 seconds"
echo "  4. Don't touch keyboard/mouse during automation (~30s)"
echo ""
read -p "Ready? Press Enter to start..."

osascript ./.claude/scripts/paste-commands.scpt

echo ""
echo "✅ Automation complete!"
echo ""
echo "📊 Next Steps:"
echo "  1. Check your browser tabs - commands should be running"
echo "  2. Monitor progress: ./.claude/scripts/dashboard.sh"
echo "  3. Check status: ./.claude/scripts/quick-status.sh"
echo ""
