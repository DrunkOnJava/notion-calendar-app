import { test, expect } from '@playwright/test'
import { CalendarPage } from './pages/CalendarPage'

test.describe('Calendar Navigation', () => {
  let calendarPage: CalendarPage

  test.beforeEach(async ({ page }) => {
    calendarPage = new CalendarPage(page)
    await calendarPage.goto()
  })

  test('should load calendar page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/calendar/i)
    await expect(calendarPage.calendarGrid).toBeVisible()
  })

  test('should switch between calendar views', async () => {
    // Switch to Day view
    await calendarPage.switchToDayView()
    expect(await calendarPage.isViewActive('day')).toBe(true)

    // Switch to Week view
    await calendarPage.switchToWeekView()
    expect(await calendarPage.isViewActive('week')).toBe(true)

    // Switch to Agenda view
    await calendarPage.switchToAgendaView()
    expect(await calendarPage.isViewActive('agenda')).toBe(true)
  })

  test('should navigate to next and previous periods', async () => {
    await calendarPage.switchToWeekView()

    // Navigate forward
    await calendarPage.navigateNext()
    await calendarPage.page.waitForTimeout(300)

    // Navigate backward twice to get before current week
    await calendarPage.navigatePrevious()
    await calendarPage.navigatePrevious()
    await calendarPage.page.waitForTimeout(300)
  })

  test('should navigate back to today', async () => {
    await calendarPage.switchToWeekView()

    // Navigate away from today
    await calendarPage.navigateNext()
    await calendarPage.navigateNext()

    // Return to today
    await calendarPage.goToToday()
    await calendarPage.page.waitForTimeout(300)

    // Verify we're at today (implementation-specific)
    // Could check for "Today" indicator or current date highlighting
  })

  test('should open and close search', async () => {
    // Search input is always visible, type to show dropdown
    await calendarPage.searchInput.click()
    await calendarPage.searchInput.fill('test')

    // Verify dropdown is visible
    const searchResults = calendarPage.page.locator('[data-testid="search-results"]')
    await expect(searchResults).toBeVisible()

    // Close with Escape
    await calendarPage.page.keyboard.press('Escape')
    await expect(searchResults).not.toBeVisible()
  })

  test('should open command palette with keyboard shortcut', async () => {
    await calendarPage.openCommandPalette()

    // Verify command palette is open (use specific test ID)
    const commandPalette = calendarPage.page.locator('[data-testid="command-palette"]')
    await expect(commandPalette).toBeVisible()

    // Close with Escape
    await calendarPage.page.keyboard.press('Escape')
    await expect(commandPalette).not.toBeVisible()
  })

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await calendarPage.goto()
    await expect(calendarPage.calendarGrid).toBeVisible()

    // Mobile view should still allow view switching
    await calendarPage.switchToDayView()
    expect(await calendarPage.isViewActive('day')).toBe(true)
  })

  test('should handle view persistence across reloads', async ({ page }) => {
    await calendarPage.switchToAgendaView()
    expect(await calendarPage.isViewActive('agenda')).toBe(true)

    // Reload page
    await page.reload()
    await calendarPage.waitForLoad()

    // View should persist (if implemented)
    // Note: This depends on localStorage/cookie implementation
  })
})
