# Claude Code on the Web - Task Delegation Guide

This guide explains how to delegate all code review fixes to Claude Code on the web for parallel, asynchronous execution.

## Prerequisites

1. ✅ GitHub account connected to Claude Code
2. ✅ Claude GitHub app installed in your repository
3. ✅ Push this repository to GitHub if not already done

## Setup Complete

I've created the following configuration files:

- `.claude/CLAUDE.md` - Project context and requirements
- `.claude/settings.json` - Auto-installs dependencies with SessionStart hook
- `.claude/commands/` - 7 custom slash commands for each task group

## Task Execution Strategy

Tasks are organized into logical groups that can run in **parallel** for maximum efficiency:

### Phase 1: Critical Fixes (Run First)
These must complete before other tasks to ensure a stable foundation.

### Phase 2: Parallel Execution
Multiple independent tasks that can run simultaneously.

### Phase 3: Advanced Features
Can be tackled after core fixes are complete.

---

## How to Delegate Tasks

### Option 1: Use Claude Code on the Web (Recommended for Parallel Execution)

1. **Visit** [claude.ai/code](https://claude.ai/code)

2. **Connect your repository** if not already done

3. **Run tasks in parallel** by starting multiple sessions:

   **Session 1 - Critical Config:**
   ```
   /fix-critical-config
   ```

   **Session 2 - Metadata:**
   ```
   /fix-metadata
   ```

   **Session 3 - Color System:**
   ```
   /fix-color-system
   ```

   **Session 4 - Environment Setup:**
   ```
   /setup-environment
   ```

   **Session 5 - Error Boundaries:**
   ```
   /add-error-boundaries
   ```

4. **Monitor progress** in each session or on your phone via Claude iOS app

5. **Review PRs** when each task completes

### Option 2: Use Local CLI (Sequential Execution)

If you prefer local execution:

```bash
cd /Users/griffin/Projects/notionCalendar

# Run tasks sequentially
claude -p "/fix-critical-config"
claude -p "/fix-metadata"
claude -p "/fix-color-system"
claude -p "/refactor-database-card"
claude -p "/setup-environment"
claude -p "/add-error-boundaries"
claude -p "/add-prettier"
claude -p "/setup-github-actions"
```

### Option 3: Batch Execution Script

Create a file `run-all-fixes.sh`:

```bash
#!/bin/bash

# Run all fixes in parallel using Claude Code on the web
echo "Starting all fix tasks in parallel..."

# Each command will open a new Claude Code web session
open "https://claude.ai/code?task=/fix-critical-config"
sleep 2
open "https://claude.ai/code?task=/fix-metadata"
sleep 2
open "https://claude.ai/code?task=/fix-color-system"
sleep 2
open "https://claude.ai/code?task=/setup-environment"
sleep 2
open "https://claude.ai/code?task=/add-error-boundaries"

echo "All tasks started! Monitor progress at claude.ai/code"
```

---

## Task Breakdown

### 1. `/fix-critical-config` (PRIORITY 1)
**Fixes:**
- TypeScript JSX configuration
- Next.js build errors setting
- Font loading and application

**Branch:** `fix/critical-configuration`
**Estimated Time:** 5-10 minutes

---

### 2. `/fix-metadata`
**Fixes:**
- Application title and description
- SEO metadata
- Author information

**Branch:** `docs/update-metadata`
**Estimated Time:** 3-5 minutes

---

### 3. `/fix-color-system`
**Fixes:**
- Destructive foreground color contrast
- Accessibility improvements

**Branch:** `fix/color-contrast`
**Estimated Time:** 3-5 minutes

---

### 4. `/refactor-database-card`
**Fixes:**
- Replace inline styles with Tailwind
- Use CSS variables instead of hard-coded colors
- Fix overflow issue

**Branch:** `refactor/database-card-styles`
**Estimated Time:** 10-15 minutes

---

### 5. `/setup-environment`
**Creates:**
- `.env.example` file
- Environment validation with Zod
- Updated `.gitignore`

**Branch:** `chore/environment-setup`
**Estimated Time:** 5-10 minutes

---

### 6. `/add-error-boundaries`
**Creates:**
- Global error boundary (`app/error.tsx`)
- 404 page (`app/not-found.tsx`)
- Loading state (`app/loading.tsx`)

**Branch:** `feat/error-boundaries`
**Estimated Time:** 8-12 minutes

---

### 7. `/add-prettier`
**Sets up:**
- Prettier configuration
- Tailwind CSS plugin for Prettier
- Format scripts in package.json

**Branch:** `chore/prettier-setup`
**Estimated Time:** 5-8 minutes

---

### 8. `/setup-github-actions`
**Creates:**
- CI workflow for linting and building
- PR title validation
- Automated checks on every push

**Branch:** `ci/github-actions`
**Estimated Time:** 8-12 minutes

---

## Monitoring Progress

### Web Interface
- Visit [claude.ai/code](https://claude.ai/code)
- View all active sessions
- See real-time progress for each task

### iOS App
- Download Claude iOS app
- Monitor sessions on the go
- Approve/steer work from your phone

### Moving to Local
If you need to take over a web session locally:
1. Click "Open in CLI" in the web interface
2. Paste and run the provided command in your terminal
3. Continue work locally

---

## After Tasks Complete

### 1. Review Pull Requests
Each task will create a separate PR. Review them in order:

1. **Critical Config** - Merge first
2. **Metadata** - Quick review and merge
3. **Color System** - Visual review in both light/dark modes
4. **Environment Setup** - Verify .env.example
5. **Error Boundaries** - Test error states
6. **Database Card Refactor** - Visual review
7. **Prettier** - Run format check
8. **GitHub Actions** - Verify workflow runs

### 2. Merge Strategy

**Option A: Sequential Merge** (Safest)
```bash
# Merge in order, testing between each
git checkout main
git pull origin fix/critical-configuration
git merge fix/critical-configuration
pnpm build  # Verify build works
git push

# Repeat for each PR
```

**Option B: Merge All at Once** (Faster)
```bash
# If all PRs pass CI/CD
gh pr merge --auto --squash <PR-NUMBER>
```

### 3. Final Verification
```bash
# Pull all merged changes
git checkout main
git pull

# Run full verification
pnpm install
pnpm type-check
pnpm lint
pnpm format:check
pnpm build
pnpm dev  # Manual testing
```

---

## Troubleshooting

### Network Access Issues
If tasks need external API access, update environment settings:
1. Go to [claude.ai/code](https://claude.ai/code)
2. Select environment settings
3. Change network access from "Limited" to "Full"

### Dependency Installation Fails
Check `.claude/settings.json` SessionStart hook:
```json
{
  "hooks": {
    "SessionStart": [{
      "matcher": "startup",
      "hooks": [{
        "type": "command",
        "command": "pnpm install"
      }]
    }]
  }
}
```

### Tasks Conflict with Each Other
This shouldn't happen as tasks are designed to be independent. If it does:
1. Complete Phase 1 (critical config) first
2. Then run other tasks in parallel

---

## Cost Optimization

- Tasks run in parallel share your account's rate limits
- Smaller, focused tasks complete faster and cost less
- Use "Limited" network access when possible
- Monitor usage at [claude.ai/settings](https://claude.ai/settings)

---

## Next Steps After All Tasks Complete

1. ✅ All critical configuration issues fixed
2. ✅ Proper error handling in place
3. ✅ Environment setup complete
4. ✅ Code formatting standardized
5. ✅ CI/CD pipeline running

**Recommended Next Steps:**
- Add Storybook for component documentation
- Implement unit tests with Vitest
- Add E2E tests with Playwright
- Set up deployment pipeline
- Add performance monitoring

---

## Questions?

- **Claude Code Docs**: [code.claude.com/docs](https://code.claude.com/docs)
- **Discord Community**: [anthropic.com/discord](https://www.anthropic.com/discord)
- **Ask Claude**: Type `/help` in any Claude Code session
