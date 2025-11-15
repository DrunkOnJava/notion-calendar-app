# Claude Code Task Monitoring

Real-time observability tools for tracking Claude Code on the web tasks.

## Quick Start

### 1. Live Dashboard (Recommended)
Full real-time dashboard with progress bars and status breakdown:

```bash
./.claude/scripts/dashboard.sh
```

**Shows:**
- Overall progress bar
- Tasks by status (merged, open PRs, working, pending)
- Recent pull requests
- Active branches
- Auto-refreshes every 10 seconds

---

### 2. Detailed Monitor
Comprehensive monitoring with task-by-task status:

```bash
./.claude/scripts/monitor-tasks.sh
```

**Shows:**
- Individual task status
- Branch creation status
- PR numbers and states
- Recent activity timeline
- Auto-refreshes every 10 seconds

**Single check mode:**
```bash
./.claude/scripts/monitor-tasks.sh --once
```

---

### 3. Quick Status Check
Fast snapshot of current state:

```bash
./.claude/scripts/quick-status.sh
```

**Shows:**
- Active branches
- Open PRs
- Recent commits on main

---

### 4. PR Watcher (Background)
Get desktop notifications when new PRs are created:

```bash
./.claude/scripts/watch-prs.sh
```

**Features:**
- Runs in background
- macOS desktop notifications
- Checks every 30 seconds
- Notifies when new PRs appear

---

## Usage Examples

### Monitor all tasks continuously
```bash
cd /Users/griffin/Projects/notionCalendar
./.claude/scripts/dashboard.sh
```

### Check status once
```bash
./.claude/scripts/monitor-tasks.sh --once
```

### Run in separate terminal tabs
```bash
# Tab 1: Live dashboard
./.claude/scripts/dashboard.sh

# Tab 2: PR watcher for notifications
./.claude/scripts/watch-prs.sh
```

### Quick checks with GitHub CLI
```bash
# List all PRs
gh pr list

# View specific PR
gh pr view <PR-NUMBER>

# Check PR status
gh pr status

# List branches
gh api repos/DrunkOnJava/notion-calendar-app/branches --jq '.[].name'
```

---

## What Each Task Creates

| Task | Branch | Expected PR Title |
|------|--------|-------------------|
| `/fix-critical-config` | `fix/critical-configuration` | fix: correct TypeScript, Next.js, and font configurations |
| `/fix-metadata` | `docs/update-metadata` | docs: update application metadata |
| `/fix-color-system` | `fix/color-contrast` | fix: improve destructive color contrast |
| `/refactor-database-card` | `refactor/database-card-styles` | refactor: convert database-card to Tailwind CSS |
| `/setup-environment` | `chore/environment-setup` | chore: add environment configuration |
| `/add-error-boundaries` | `feat/error-boundaries` | feat: add error boundaries and loading states |
| `/add-prettier` | `chore/prettier-setup` | chore: add Prettier for code formatting |
| `/setup-github-actions` | `ci/github-actions` | ci: add GitHub Actions workflows |

---

## Monitoring Checklist

### When Task Starts
- [ ] See "Hatching..." message in Claude Code web
- [ ] Dependencies installed via SessionStart hook

### During Execution (2-10 minutes)
- [ ] Branch appears in GitHub
- [ ] Commits show up on the branch
- [ ] Build/tests run successfully

### Task Complete
- [ ] Pull request created
- [ ] PR title matches expected format
- [ ] All checks pass (if CI/CD configured)
- [ ] Desktop notification (if using watch-prs.sh)

---

## Troubleshooting

### Scripts require GitHub CLI
```bash
# Install
brew install gh

# Authenticate
gh auth login
```

### No branches showing up
- Check Claude Code web interface for errors
- Verify task is actually running
- Confirm repository permissions

### Tasks taking longer than expected
- Check network access settings in Claude Code web
- Verify SessionStart hook completed successfully
- Look for build errors in the web interface

---

## Advanced Monitoring

### Watch specific branch
```bash
git fetch origin fix/critical-configuration
git log origin/fix/critical-configuration --oneline
```

### Check CI/CD status (after GitHub Actions setup)
```bash
gh run list
gh run view <run-id>
```

### Monitor with custom interval
```bash
# Edit scripts and change CHECK_INTERVAL=10 to desired seconds
```

### Export status to JSON
```bash
gh pr list --json number,title,state,headRefName > pr-status.json
```

---

## Integration with Your Workflow

### Add to VS Code tasks
Add to `.vscode/tasks.json`:
```json
{
  "label": "Monitor Claude Tasks",
  "type": "shell",
  "command": "${workspaceFolder}/.claude/scripts/dashboard.sh",
  "problemMatcher": []
}
```

### Add shell aliases
Add to `~/.zshrc`:
```bash
alias cc-monitor="cd ~/Projects/notionCalendar && ./.claude/scripts/dashboard.sh"
alias cc-status="cd ~/Projects/notionCalendar && ./.claude/scripts/quick-status.sh"
alias cc-watch="cd ~/Projects/notionCalendar && ./.claude/scripts/watch-prs.sh &"
```

---

## Real-Time Web Monitoring

**Claude Code Web Interface:**
- Visit [claude.ai/code](https://claude.ai/code)
- See real-time logs
- Steer the agent mid-execution
- Approve tool usage

**GitHub Repository:**
- Watch the [Branches page](https://github.com/DrunkOnJava/notion-calendar-app/branches)
- Monitor [Pull Requests](https://github.com/DrunkOnJava/notion-calendar-app/pulls)
- Check [Actions](https://github.com/DrunkOnJava/notion-calendar-app/actions) (after CI setup)

---

## Tips

- **Run dashboard.sh in a dedicated terminal** - Easy glance at progress
- **Use watch-prs.sh in background** - Get notified without checking manually
- **Combine with web interface** - Scripts for overview, web for details
- **Check once with --once flag** - Quick status without continuous monitoring

---

## What Success Looks Like

```
Overall Progress: [████████████████████████████░░░░] 75% (6/8)

Status Breakdown:
  ✓ Merged:        6/8
  📝 Pull Requests: 2
  🔨 Working:       0
  ⏳ Pending:       0
```
