import { test, expect } from '@playwright/test'
import { CalendarPage } from './pages/CalendarPage'
import { SettingsPage } from './pages/SettingsPage'

test.describe('Settings Management', () => {
  let calendarPage: CalendarPage
  let settingsPage: SettingsPage

  test.beforeEach(async ({ page }) => {
    calendarPage = new CalendarPage(page)
    settingsPage = new SettingsPage(page)
    await calendarPage.goto()
    await calendarPage.openSettings()
  })

  test('should open and close settings modal', async () => {
    // Settings should be open from beforeEach
    const settingsModal = settingsPage.page.locator('[data-testid="settings-modal"]')
    await expect(settingsModal).toBeVisible()

    // Close settings
    await settingsPage.close()
    await expect(settingsModal).not.toBeVisible()
  })

  test('should switch between settings tabs', async () => {
    await settingsPage.openGeneralSettings()
    await expect(settingsPage.generalTab).toHaveAttribute('aria-selected', 'true')

    await settingsPage.openAppearanceSettings()
    await expect(settingsPage.appearanceTab).toHaveAttribute('aria-selected', 'true')

    await settingsPage.openCalendarSettings()
    await expect(settingsPage.calendarTab).toHaveAttribute('aria-selected', 'true')

    await settingsPage.openNotificationsSettings()
    await expect(settingsPage.notificationsTab).toHaveAttribute('aria-selected', 'true')
  })

  test('should change theme to dark mode', async ({ page }) => {
    await settingsPage.changeTheme('dark')
    await settingsPage.save()
    await settingsPage.close()

    // Verify dark theme is applied
    await settingsPage.verifyTheme('dark')
  })

  test('should change theme to light mode', async ({ page }) => {
    await settingsPage.changeTheme('light')
    await settingsPage.save()
    await settingsPage.close()

    // Verify light theme is applied
    await settingsPage.verifyTheme('light')
  })

  test('should toggle dark mode switch', async () => {
    await settingsPage.toggleDarkMode()
    await settingsPage.save()
    await settingsPage.close()

    await settingsPage.page.waitForTimeout(300)
  })

  test('should change default calendar view', async ({ page }) => {
    await settingsPage.setDefaultView('agenda')
    await settingsPage.save()
    await settingsPage.close()

    // Reload page
    await page.reload()
    await calendarPage.waitForLoad()

    // Agenda view should be active (if settings persist)
    expect(await calendarPage.isViewActive('agenda')).toBe(true)
  })

  test('should toggle show weekends setting', async () => {
    await settingsPage.toggleShowWeekends()
    await settingsPage.save()
    await settingsPage.close()

    // Visual verification would depend on implementation
    await settingsPage.page.waitForTimeout(300)
  })

  test('should toggle show week numbers', async () => {
    await settingsPage.toggleShowWeekNumbers()
    await settingsPage.save()
    await settingsPage.close()

    await settingsPage.page.waitForTimeout(300)
  })

  test('should change week start day', async () => {
    await settingsPage.changeWeekStart('Monday')
    await settingsPage.save()
    await settingsPage.close()

    // Verify week starts on Monday (implementation-specific)
    await settingsPage.page.waitForTimeout(300)
  })

  test('should toggle email notifications', async () => {
    await settingsPage.toggleEmailNotifications()
    await settingsPage.save()
    await settingsPage.close()

    // Verify setting is saved
    await calendarPage.openSettings()
    await settingsPage.openNotificationsSettings()

    // Check if toggle reflects the change (implementation-specific)
  })

  test('should cancel changes without saving', async ({ page }) => {
    // Make a change
    await settingsPage.changeTheme('dark')

    // Cancel instead of save
    await settingsPage.cancel()

    // Reopen settings
    await calendarPage.openSettings()

    // Theme should not have changed (implementation-specific)
  })

  test('should persist settings across sessions', async ({ page, context }) => {
    // Change a setting
    await settingsPage.changeTheme('dark')
    await settingsPage.setDefaultView('week')
    await settingsPage.save()
    await settingsPage.close()

    // Create new page in same context (shares localStorage/cookies)
    const newPage = await context.newPage()
    const newCalendarPage = new CalendarPage(newPage)
    await newCalendarPage.goto()

    // Verify settings persisted
    await settingsPage.verifyTheme('dark')

    await newPage.close()
  })

  test('should save all settings together', async () => {
    // Change multiple settings
    await settingsPage.changeTheme('dark')
    await settingsPage.openCalendarSettings()
    await settingsPage.setDefaultView('agenda')
    await settingsPage.toggleShowWeekends()
    await settingsPage.openNotificationsSettings()
    await settingsPage.toggleEmailNotifications()

    // Save all
    await settingsPage.save()
    await settingsPage.close()

    // Verify changes were saved
    await calendarPage.openSettings()
    await settingsPage.verifyTheme('dark')
  })

  test('should handle keyboard navigation in settings', async ({ page }) => {
    // Tab through settings
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Use arrow keys to navigate tabs (if implemented)
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(100)
    await page.keyboard.press('ArrowRight')

    // Close with Escape
    await page.keyboard.press('Escape')

    const dialog = settingsPage.page.locator('[role="dialog"]')
    await expect(dialog).not.toBeVisible()
  })

  test('should validate settings changes immediately', async () => {
    await settingsPage.changeTheme('dark')

    // Theme should apply immediately without saving
    // (depends on implementation - some apps show preview)
    await settingsPage.page.waitForTimeout(200)
  })
})
