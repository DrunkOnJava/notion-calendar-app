# E2E Testing Quick Start Guide

Complete setup guide for running end-to-end tests with Playwright on the Notion Calendar app.

## 🚀 First Time Setup

### 1. Install Playwright Browsers

```bash
pnpm test:e2e:install
```

This installs Chromium, Firefox, and WebKit browsers with all required dependencies.

### 2. Verify Installation

```bash
pnpm test:e2e --project=chromium
```

## 🎯 Daily Usage

### Run All Tests (Headless)

```bash
pnpm test:e2e
```

Runs all tests across all browsers in headless mode. Best for CI/CD and quick validation.

### Development Mode (Recommended)

```bash
pnpm test:e2e:ui
```

Opens Playwright UI with:

- ✨ Visual test runner
- ⏱️ Time-travel debugging
- 🔍 Locator picker
- 📊 Test results dashboard

**This is the best mode for writing and debugging tests.**

### Run Specific Browser

```bash
pnpm test:e2e:chromium   # Chrome/Edge
pnpm test:e2e:firefox    # Firefox
pnpm test:e2e:webkit     # Safari
```

### Mobile Testing

```bash
pnpm test:e2e:mobile
```

Runs tests on mobile viewports (iPhone, Pixel).

## 🐛 Debugging Failed Tests

### Option 1: UI Mode (Easiest)

```bash
pnpm test:e2e:ui
```

Click on failed test → See visual timeline → Click through each step

### Option 2: Debug Mode

```bash
pnpm test:e2e:debug
```

Opens Playwright Inspector with step-by-step execution.

### Option 3: Headed Mode

```bash
pnpm test:e2e:headed
```

Watch the browser execute tests in real-time.

### Option 4: View Last Report

```bash
pnpm test:e2e:report
```

Opens HTML report of last test run with screenshots and traces.

## 📝 Writing New Tests

### Step 1: Generate Test Code

```bash
pnpm test:e2e:codegen
```

- Opens browser and Playwright Inspector
- Record your actions
- Get generated test code
- Copy into your spec file

### Step 2: Create Test File

```typescript
// e2e/my-feature.spec.ts
import { test, expect } from '@playwright/test'
import { CalendarPage } from './pages/CalendarPage'

test.describe('My Feature', () => {
  let calendarPage: CalendarPage

  test.beforeEach(async ({ page }) => {
    calendarPage = new CalendarPage(page)
    await calendarPage.goto()
  })

  test('should do something useful', async () => {
    // Your test here
    await calendarPage.switchToDayView()
    await expect(calendarPage.dayViewButton).toHaveAttribute('aria-pressed', 'true')
  })
})
```

### Step 3: Run Your Test

```bash
pnpm test:e2e -- my-feature.spec.ts
```

## 📂 Test Structure

```
e2e/
├── pages/                           # Page Object Models
│   ├── BasePage.ts                  # Common page methods
│   ├── CalendarPage.ts              # Calendar interactions
│   ├── EventPage.ts                 # Event CRUD operations
│   └── SettingsPage.ts              # Settings modal
│
├── fixtures/                        # Test data
│   └── test-data.ts                 # Reusable test data
│
├── calendar-navigation.spec.ts      # View switching, navigation
├── event-management.spec.ts         # Create, edit, delete events
├── settings.spec.ts                 # Settings workflows
└── search-and-filters.spec.ts       # Search functionality
```

## 🎨 Using Page Objects

Page Objects make tests cleaner and more maintainable:

```typescript
// ❌ Without Page Objects (brittle, hard to maintain)
await page.click('[data-testid="create-event"]')
await page.fill('input[name="title"]', 'Meeting')
await page.click('button[type="submit"]')

// ✅ With Page Objects (clean, maintainable)
await calendarPage.openCreateEvent()
await eventPage.createEvent({ title: 'Meeting' })
```

## 📊 Test Data Fixtures

Use predefined test data for consistency:

```typescript
import { testEvents, generateRandomEvent } from './fixtures/test-data'

// Predefined test data
await eventPage.createEvent(testEvents.withLocation)
await eventPage.createEvent(testEvents.allDay)

// Random test data
const randomEvent = generateRandomEvent()
await eventPage.createEvent(randomEvent)
```

## 🔄 CI/CD Integration

Tests automatically run on GitHub Actions:

- ✅ Every push to `main` or `develop`
- ✅ Every pull request
- ✅ Parallel execution across browsers
- ✅ Automatic retries for flaky tests
- ✅ HTML reports uploaded as artifacts

See `.github/workflows/e2e-tests.yml` for configuration.

## 🎭 Common Playwright Patterns

### Wait for Element

```typescript
// ✅ Automatic waiting (preferred)
await page.click('button')

// Use only when absolutely necessary
await page.waitForSelector('button', { state: 'visible' })
```

### Assertions

```typescript
// Element visibility
await expect(page.getByRole('button', { name: 'Save' })).toBeVisible()

// Text content
await expect(page.locator('.event-title')).toContainText('Meeting')

// Attribute
await expect(page.locator('.theme-toggle')).toHaveAttribute('aria-pressed', 'true')
```

### Keyboard Actions

```typescript
// Single key
await page.keyboard.press('Enter')
await page.keyboard.press('Escape')

// Shortcuts
await page.keyboard.press('Meta+K') // Cmd+K on Mac
await page.keyboard.press('Control+K') // Ctrl+K on Windows
```

### File Uploads

```typescript
await page.setInputFiles('input[type="file"]', 'path/to/file.pdf')
```

## 🚨 Troubleshooting

### Tests Timeout

**Problem**: Tests hang or timeout
**Solution**:

```bash
# Check dev server is running
pnpm dev

# Increase timeout in playwright.config.ts
timeout: 60 * 1000  // 60 seconds
```

### Element Not Found

**Problem**: `locator.click: Target closed` or element not found
**Solution**:

```bash
# Use Playwright Inspector to debug
pnpm test:e2e:debug

# Or UI mode to inspect
pnpm test:e2e:ui
```

### Flaky Tests

**Problem**: Tests pass sometimes, fail other times
**Solution**:

- Remove hard-coded `page.waitForTimeout()` calls
- Use proper wait conditions: `waitForLoadState('networkidle')`
- Add `{ strict: true }` to selectors to ensure single match

### Browser Not Installed

**Problem**: `browserType.launch: Executable doesn't exist`
**Solution**:

```bash
pnpm test:e2e:install
```

## 📚 Resources

- **Playwright Docs**: https://playwright.dev/
- **E2E README**: `e2e/README.md`
- **Test Examples**: See `e2e/*.spec.ts` files
- **Page Objects**: See `e2e/pages/` directory

## 💡 Pro Tips

1. **Use UI Mode** for development - it's the fastest way to debug
2. **Add `data-testid`** to components for stable selectors
3. **Keep tests independent** - each test should work in isolation
4. **Use Page Objects** - don't duplicate selectors across tests
5. **Generate tests** with codegen, then refactor to use Page Objects
6. **Run in parallel** - Playwright handles this automatically
7. **Check CI artifacts** - Download HTML reports from failed CI runs

## 🎯 Next Steps

1. Run your first test: `pnpm test:e2e:ui`
2. Explore existing tests in `e2e/` directory
3. Try codegen: `pnpm test:e2e:codegen`
4. Write a new test for your feature
5. Add tests to your pull request

---

**Questions?** Check the [Playwright documentation](https://playwright.dev/) or review existing tests for examples.
