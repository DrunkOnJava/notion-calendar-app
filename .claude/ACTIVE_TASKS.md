# Active Claude Code Tasks - Quick Reference

**Status:** 7 tasks launched in parallel
**Time Started:** $(date)
**PR #1 Status:** ✅ MERGED

---

## 🚀 Tasks Running in Parallel

You should now have **7 browser tabs** open at [claude.ai/code](https://claude.ai/code).

### In Each Tab:
1. **Select repository:** `DrunkOnJava/notion-calendar-app`
2. **Type the command** shown below

---

## 📋 Task Checklist

### Tab 1: Update Metadata
```
/fix-metadata
```
**Expected:** 3-5 minutes
**Branch:** `docs/update-metadata`
**Changes:** Update title, description, keywords

---

### Tab 2: Fix Color Contrast
```
/fix-color-system
```
**Expected:** 3-5 minutes
**Branch:** `fix/color-contrast`
**Changes:** Improve destructive color contrast

---

### Tab 3: Refactor Database Card
```
/refactor-database-card
```
**Expected:** 10-15 minutes
**Branch:** `refactor/database-card-styles`
**Changes:** Convert to Tailwind CSS, remove inline styles

---

### Tab 4: Environment Setup
```
/setup-environment
```
**Expected:** 5-10 minutes
**Branch:** `chore/environment-setup`
**Changes:** Create .env.example, add Zod validation

---

### Tab 5: Error Boundaries
```
/add-error-boundaries
```
**Expected:** 8-12 minutes
**Branch:** `feat/error-boundaries`
**Changes:** Add error.tsx, not-found.tsx, loading.tsx

---

### Tab 6: Prettier Setup
```
/add-prettier
```
**Expected:** 5-8 minutes
**Branch:** `chore/prettier-setup`
**Changes:** Add Prettier config and scripts

---

### Tab 7: GitHub Actions
```
/setup-github-actions
```
**Expected:** 8-12 minutes
**Branch:** `ci/github-actions`
**Changes:** Add CI/CD workflows

---

## 🔍 Monitor Progress

### Terminal Dashboard (Already Running)
Your live dashboard shows real-time progress with visual bars.

### Quick Status Check
```bash
./.claude/scripts/quick-status.sh
```

### Watch for New PRs
```bash
# Check every 30 seconds
watch -n 30 'gh pr list'
```

---

## 📊 Expected Timeline

| Time | What You'll See |
|------|-----------------|
| **Now** | All 7 tasks "Hatching..." |
| **5 min** | First 2-3 PRs created (metadata, color-system) |
| **10 min** | 4-5 PRs created (environment, prettier added) |
| **15 min** | All 7 PRs created and ready for review |

---

## ✅ When Tasks Complete

You'll see in your monitoring dashboard:
```
Overall Progress: [████████████████████████████] 100% (8/8)

Status Breakdown:
  ✓ Merged:        1/8  (PR #1)
  📝 Pull Requests: 7    (PR #2-8)
  🔨 Working:       0
  ⏳ Pending:       0
```

---

## 🎯 After All PRs Are Created

### Review All PRs at Once
```bash
gh pr list
```

### Merge All PRs
```bash
# Review each PR
for pr in {2..8}; do gh pr view $pr; done

# Merge all at once (if all look good)
for pr in {2..8}; do gh pr merge $pr --squash; done
```

### Or Merge Selectively
```bash
# Merge specific PRs
gh pr merge 2 --squash  # metadata
gh pr merge 3 --squash  # color-system
# ... etc
```

---

## 🚨 Troubleshooting

### Task Stuck?
- Check the Claude Code web interface for errors
- Click into the task to see detailed logs
- Use "Open in CLI" to take over locally if needed

### Network Issues?
- Tasks will retry automatically
- Check `.claude/settings.json` environment settings
- Verify GitHub app permissions

### Need to Stop a Task?
- Close the browser tab
- Task will continue running in cloud
- Reopen tab to resume monitoring

---

## 📈 Success Metrics

After all tasks complete, you should have:
- ✅ 8 PRs merged (including #1)
- ✅ All critical issues fixed
- ✅ Proper error handling in place
- ✅ Environment setup complete
- ✅ Code formatting standardized
- ✅ CI/CD pipeline running

---

**Next Update:** Check monitoring dashboard in 5 minutes to see first completed tasks!
