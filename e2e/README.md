# End-to-End Tests

Comprehensive E2E test suite for Notion Calendar using Playwright.

## 📁 Structure

```
e2e/
├── pages/              # Page Object Models
│   ├── BasePage.ts     # Base page with common methods
│   ├── CalendarPage.ts # Calendar view interactions
│   ├── EventPage.ts    # Event creation/editing
│   └── SettingsPage.ts # Settings modal
├── fixtures/           # Test data and helpers
│   └── test-data.ts    # Reusable test data
├── utils/              # Test utilities
├── *.spec.ts           # Test files
└── README.md           # This file
```

## 🚀 Quick Start

### Install Playwright Browsers

```bash
pnpm test:e2e:install
```

### Run All Tests

```bash
pnpm test:e2e
```

### Run Tests in UI Mode (Recommended for Development)

```bash
pnpm test:e2e:ui
```

### Run Tests with Browser Visible

```bash
pnpm test:e2e:headed
```

### Debug Tests

```bash
pnpm test:e2e:debug
```

## 📝 Available Test Scripts

| Script | Description |
|--------|-------------|
| `pnpm test:e2e` | Run all tests headlessly |
| `pnpm test:e2e:ui` | Open Playwright UI mode (best for development) |
| `pnpm test:e2e:headed` | Run tests with browser visible |
| `pnpm test:e2e:debug` | Run tests in debug mode with Playwright Inspector |
| `pnpm test:e2e:chromium` | Run tests in Chromium only |
| `pnpm test:e2e:firefox` | Run tests in Firefox only |
| `pnpm test:e2e:webkit` | Run tests in WebKit (Safari) only |
| `pnpm test:e2e:mobile` | Run tests on mobile viewports |
| `pnpm test:e2e:report` | View last test report |
| `pnpm test:e2e:codegen` | Generate tests interactively |

## 📋 Test Suites

### Calendar Navigation (`calendar-navigation.spec.ts`)
- ✅ Page loading
- ✅ View switching (Day/Week/Agenda)
- ✅ Navigation (Next/Previous/Today)
- ✅ Search functionality
- ✅ Command palette
- ✅ Responsive design

### Event Management (`event-management.spec.ts`)
- ✅ Create events (simple, all-day, recurring)
- ✅ Edit events
- ✅ Delete events
- ✅ Context menu actions
- ✅ Duplicate events
- ✅ Form validation
- ✅ Time slot interactions
- ✅ Overlapping events

### Settings (`settings.spec.ts`)
- ✅ Theme switching (Light/Dark/System)
- ✅ Default view preferences
- ✅ Calendar settings
- ✅ Notification toggles
- ✅ Settings persistence
- ✅ Keyboard navigation

### Search and Filters (`search-and-filters.spec.ts`)
- ✅ Search by title
- ✅ Search by description
- ✅ Real-time filtering
- ✅ Keyboard shortcuts
- ✅ Case-insensitive search
- ✅ Special character handling
- ✅ Cross-view search

## 🎯 Page Object Model Pattern

Tests use the Page Object Model pattern for better maintainability:

```typescript
import { CalendarPage } from './pages/CalendarPage'
import { EventPage } from './pages/EventPage'

test('should create event', async ({ page }) => {
  const calendarPage = new CalendarPage(page)
  const eventPage = new EventPage(page)

  await calendarPage.goto()
  await calendarPage.openCreateEvent()
  await eventPage.createEvent({
    title: 'Team Meeting',
    description: 'Weekly sync',
  })
})
```

## 📊 Test Data Fixtures

Reusable test data is available in `fixtures/test-data.ts`:

```typescript
import { testEvents, testSettings } from './fixtures/test-data'

// Use predefined test data
await eventPage.createEvent(testEvents.withLocation)
await settingsPage.changeTheme(testSettings.darkTheme.theme)

// Or generate random data
import { generateRandomEvent } from './fixtures/test-data'
const randomEvent = generateRandomEvent()
```

## 🔍 Debugging Tips

### 1. Use UI Mode (Best Option)
```bash
pnpm test:e2e:ui
```
- See tests run in real-time
- Time-travel through each action
- Edit locators on the fly
- Great visual debugging

### 2. Use Debug Mode
```bash
pnpm test:e2e:debug
```
- Playwright Inspector opens
- Step through each action
- Inspect page at any point

### 3. Run Headed Mode
```bash
pnpm test:e2e:headed
```
- See browser window
- Watch tests execute
- Good for understanding failures

### 4. Use Codegen to Create Tests
```bash
pnpm test:e2e:codegen
```
- Record your actions
- Generate test code automatically
- Great for learning selectors

### 5. Add Debug Points in Tests
```typescript
test('my test', async ({ page }) => {
  await page.pause() // Pauses execution
  // ... rest of test
})
```

## 📸 Screenshots and Videos

Playwright automatically captures:
- **Screenshots** on test failure
- **Videos** for failed tests (in `test-results/`)
- **Traces** on first retry (viewable with `playwright show-trace`)

## 🌐 Browser Support

Tests run on:
- ✅ Chromium (Chrome, Edge)
- ✅ Firefox
- ✅ WebKit (Safari)
- ✅ Mobile Chrome
- ✅ Mobile Safari

Configure in `playwright.config.ts`.

## 🚦 CI/CD Integration

Tests are configured to run in GitHub Actions (see `.github/workflows/e2e.yml`):
- Runs on every PR
- Parallel execution
- Test reports uploaded as artifacts
- Retries failed tests automatically

## 📐 Writing New Tests

### 1. Create a new spec file
```bash
touch e2e/my-feature.spec.ts
```

### 2. Follow the pattern
```typescript
import { test, expect } from '@playwright/test'
import { CalendarPage } from './pages/CalendarPage'

test.describe('My Feature', () => {
  let calendarPage: CalendarPage

  test.beforeEach(async ({ page }) => {
    calendarPage = new CalendarPage(page)
    await calendarPage.goto()
  })

  test('should do something', async () => {
    // Your test here
  })
})
```

### 3. Run your tests
```bash
pnpm test:e2e -- my-feature.spec.ts
```

## 🎨 Best Practices

1. **Use Page Objects**: Keep tests DRY and maintainable
2. **Use data-testid**: Add stable test selectors in components
3. **Avoid hard-coded waits**: Use Playwright's auto-waiting
4. **Test user workflows**: Not individual functions
5. **Keep tests isolated**: Each test should be independent
6. **Use fixtures**: Reusable test data for consistency
7. **Name tests clearly**: Describe the expected behavior
8. **Clean up after tests**: Reset state when needed

## 🐛 Common Issues

### Test Timeout
- Increase timeout in `playwright.config.ts`
- Check if dev server is running
- Verify network conditions

### Element Not Found
- Use Playwright Inspector to check locators
- Add explicit waits if needed
- Check if element is in shadow DOM

### Flaky Tests
- Avoid hard-coded timeouts
- Use proper wait conditions
- Check for race conditions

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Writing Tests Guide](https://playwright.dev/docs/writing-tests)

## 🤝 Contributing

When adding new features:
1. Write E2E tests for critical user workflows
2. Add Page Objects for new pages/modals
3. Update this README if adding new patterns
4. Ensure tests pass in all browsers

## 📞 Support

For questions or issues with E2E tests:
- Check Playwright documentation
- Review existing tests for examples
- Ask in team chat or create an issue

---

**Happy Testing! 🎭**
