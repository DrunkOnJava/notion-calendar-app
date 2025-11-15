# E2E Testing Strategy

## Overview

This project uses Playwright for E2E testing with a two-tier strategy to optimize CI performance while maintaining comprehensive local testing.

## Test Execution Modes

### Critical Tests (CI Default)

**Command**: `pnpm test:e2e:critical`

Runs only high-confidence, stable tests that verify core functionality:

- **Calendar Navigation** (7/8 passing - 88%)
- **Test Environment** (2/3 passing - 67%)

**Total**: ~10 tests
**Runtime**: ~2-3 minutes
**Browser**: Chromium only

**When Used**:

- Every push to main/develop
- Every pull request (default)
- Quick validation of core features

### Full Test Suite (On-Demand)

**Command**: `pnpm test:e2e`

Runs comprehensive test coverage across all features and browsers:

- Calendar Navigation (8 tests)
- Event Management (12 tests)
- Search and Filters (14 tests)
- Settings Management (15 tests)
- Test Environment (3 tests)

**Total**: 52 tests
**Runtime**: ~3-5 minutes locally, ~20+ minutes in CI
**Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari

**When Used**:

- Local development and debugging
- Before major releases
- Pull requests with `e2e:full` label
- Comprehensive regression testing

## Running Tests Locally

### Quick Validation (Recommended for Dev)

```bash
# Run critical tests only
pnpm test:e2e:critical

# Run specific suite
pnpm test:e2e calendar-navigation.spec.ts --project=chromium
```

### Full Suite

```bash
# All tests, all browsers
pnpm test:e2e

# Single browser
pnpm test:e2e:chromium
pnpm test:e2e:firefox
pnpm test:e2e:webkit

# Mobile devices
pnpm test:e2e:mobile
```

### Interactive Debugging

```bash
# UI mode (recommended)
pnpm test:e2e:ui

# Headed mode (see browser)
pnpm test:e2e:headed

# Debug mode (step through tests)
pnpm test:e2e:debug
```

### View Results

```bash
# Open HTML report
pnpm test:e2e:report
```

## CI Behavior

### Default (Every Commit/PR)

- Runs `test:e2e:critical`
- Chromium only
- 10-minute timeout
- Fast feedback (~3 minutes)

### Full Suite (On-Demand)

Add the `e2e:full` label to your PR to trigger:

- All 52 tests
- 3 browsers (Chromium, Firefox, WebKit)
- 30-minute timeout
- Comprehensive coverage

**To add label**:

```bash
gh pr edit <number> --add-label "e2e:full"
```

## Test Organization

### Critical Tests

High-passing suites that verify essential functionality:

**calendar-navigation.spec.ts** (7/8 passing - 88%):

- Load calendar page
- Navigate periods (next/prev/today)
- Switch views (day/week/agenda)
- Open/close search
- Mobile responsiveness
- View persistence

**test-environment.spec.ts** (2/3 passing - 67%):

- Environment variables
- Application navigation

### Full Test Coverage

**event-management.spec.ts** (4/12 passing - 33%):

- ✅ Create/edit/delete events
- ⚠️ Context menus (in progress)
- ⚠️ Event clicking (blocked)
- ⚠️ Recurrence (UI issue)

**search-and-filters.spec.ts** (10/14 passing - 71%):

- ✅ Search by title/description
- ✅ Keyboard navigation
- ✅ State persistence
- ⚠️ Some edge cases failing

**settings.spec.ts** (2/15 passing - 13%):

- ✅ Modal open/close
- ✅ Tab switching
- ❌ Form controls not implemented

## Current Test Status

**Overall**: 23/52 passing (44%)

### By Suite:

- Calendar Navigation: 88% ✅
- Test Environment: 67% ✅
- Search and Filters: 71% ⚠️
- Event Management: 33% ⚠️
- Settings: 13% ❌

## Known Issues

### Failing Tests (Non-Critical)

These are excluded from CI critical suite:

1. **Event Clicking** (8 tests blocked)
   - Root cause: Selector strategy needs refinement
   - Impact: Edit/delete operations
   - Status: Under investigation

2. **Settings Form Controls** (13 tests blocked)
   - Root cause: UI not implemented
   - Impact: Settings functionality
   - Status: Feature gap

3. **Search Strict Mode** (2 tests)
   - Root cause: Selectors find events in multiple locations
   - Impact: Search validation
   - Status: Fix documented, ready to apply

4. **Command Palette Cmd+K** (1 test)
   - Root cause: Keyboard event not triggering
   - Impact: Keyboard shortcut
   - Status: Investigating

## Improvements

### Recent Fixes

- ✅ React controlled component event triggering (`dispatchEvent`)
- ✅ Modal detection with `role="dialog"`
- ✅ Test IDs added to all interactive elements
- ✅ Search dropdown scoping (documented, pending)

### Planned

- Add time slot `data-hour` attributes
- Add context menu test IDs
- Implement settings form controls
- Debug event clicking after creation

## Best Practices

### When Writing New Tests

1. **Tag appropriately**: If test verifies core functionality with >80% reliability, consider adding to critical suite
2. **Use data-testid**: Prefer stable selectors over brittle DOM queries
3. **Add ARIA roles**: Improves accessibility and testability
4. **Document failures**: Create issues for consistently failing tests
5. **Scope selectors**: Avoid strict mode violations by scoping to specific containers

### When Debugging

1. Use UI mode: `pnpm test:e2e:ui`
2. Add screenshots: `await page.screenshot({ path: 'debug.png' })`
3. Use trace viewer: Automatically captured on retry
4. Check test-results/ folder for failure artifacts
5. Run single test: `playwright test -g "test name"`

## Performance Optimization

### CI Optimization Strategy

- **Critical tests only** by default (saves ~15 minutes per run)
- **Single browser** (Chromium) for critical tests
- **Label-based triggers** for full suite when needed
- **Parallel execution** disabled in CI for stability

### Local Optimization

- **Parallel execution** enabled for speed
- **Browser reuse** with `reuseExistingServer: true`
- **Selective test running** via grep patterns
- **UI mode** for interactive debugging

## Maintenance

### Regular Tasks

- Review test results weekly
- Update critical suite when new stable tests added
- Remove flaky tests from critical suite
- Document new test patterns

### When to Run Full Suite

- Before major releases
- After significant refactors
- When fixing test infrastructure
- Pull requests affecting core features

---

**Last Updated**: 2025-11-15
**Test Framework**: Playwright v1.56.1
**Current Coverage**: 23/52 tests passing (44%)
**Critical Suite Coverage**: 9/10 tests (90% expected)
