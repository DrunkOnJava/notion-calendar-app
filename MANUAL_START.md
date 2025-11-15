# Quick Manual Start (Most Reliable)

The slash commands need to be in GitHub for Claude Code on the web to recognize them.

## ✅ Commands are NOW in GitHub (just pushed)

The commands should work now! If you're seeing "Unknown slash command", refresh your browser tabs.

---

## 🎯 Three Ways to Launch Tasks

### Option 1: Clipboard Helper (Recommended)

Most reliable - uses your clipboard:

```bash
./.claude/scripts/clipboard-helper.sh
```

**How it works:**

1. Script copies first command to clipboard
2. You press Cmd+V in Chrome tab
3. Press Enter in terminal
4. Repeat for all 7 commands

**Time:** ~2 minutes total

---

### Option 2: AppleScript (If Chrome is focused)

```bash
./.claude/scripts/paste-commands.scpt
```

**Requirements:**

- Chrome must be frontmost
- Active tab must be on claude.ai/code
- Don't touch keyboard for 30 seconds

---

### Option 3: Fully Manual (Always Works)

Go to each Chrome tab and type:

1. `/fix-metadata`
2. `/fix-color-system`
3. `/refactor-database-card`
4. `/setup-environment`
5. `/add-error-boundaries`
6. `/add-prettier`
7. `/setup-github-actions`

---

## 🔧 Troubleshooting "Unknown slash command"

### Issue: Commands not recognized

**Solution 1: Refresh Browser Tabs**
Press Cmd+R in each Claude.ai tab to reload

**Solution 2: Verify GitHub Push**

```bash
git log --oneline -1
# Should show: "feat: add robust AppleScript automation"
```

**Solution 3: Check GitHub**
Visit: https://github.com/DrunkOnJava/notion-calendar-app/tree/main/.claude/commands

You should see all 8 command files.

---

## ✅ Recommended: Use Clipboard Helper

```bash
./.claude/scripts/clipboard-helper.sh
```

This is the most reliable method!
