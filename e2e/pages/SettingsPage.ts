import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * Page Object for Settings Modal
 */
export class SettingsPage extends BasePage {
  // Settings Tabs
  readonly generalTab: Locator
  readonly appearanceTab: Locator
  readonly calendarTab: Locator
  readonly notificationsTab: Locator

  // General Settings
  readonly timezoneSelect: Locator
  readonly weekStartSelect: Locator
  readonly timeFormatSelect: Locator

  // Appearance Settings
  readonly themeSelect: Locator
  readonly darkModeToggle: Locator
  readonly lightModeOption: Locator
  readonly darkModeOption: Locator
  readonly systemModeOption: Locator

  // Calendar Settings
  readonly defaultViewSelect: Locator
  readonly showWeekendsToggle: Locator
  readonly showWeekNumbersToggle: Locator

  // Notifications Settings
  readonly emailNotificationsToggle: Locator
  readonly pushNotificationsToggle: Locator
  readonly eventRemindersToggle: Locator

  // Actions
  readonly saveButton: Locator
  readonly cancelButton: Locator
  readonly closeButton: Locator

  constructor(page: Page) {
    super(page)

    // Tabs
    this.generalTab = page.getByRole('tab', { name: /general/i })
    this.appearanceTab = page.getByRole('tab', { name: /appearance/i })
    this.calendarTab = page.getByRole('tab', { name: /calendar/i })
    this.notificationsTab = page.getByRole('tab', { name: /notifications/i })

    // General
    this.timezoneSelect = page.getByLabel(/timezone/i)
    this.weekStartSelect = page.getByLabel(/week start/i)
    this.timeFormatSelect = page.getByLabel(/time format/i)

    // Appearance
    this.themeSelect = page.getByLabel(/theme/i)
    this.darkModeToggle = page.getByLabel(/dark mode/i)
    this.lightModeOption = page.getByRole('option', { name: /light/i })
    this.darkModeOption = page.getByRole('option', { name: /dark/i })
    this.systemModeOption = page.getByRole('option', { name: /system/i })

    // Calendar
    this.defaultViewSelect = page.getByLabel(/default view/i)
    this.showWeekendsToggle = page.getByLabel(/show weekends/i)
    this.showWeekNumbersToggle = page.getByLabel(/show week numbers/i)

    // Notifications
    this.emailNotificationsToggle = page.getByLabel(/email notifications/i)
    this.pushNotificationsToggle = page.getByLabel(/push notifications/i)
    this.eventRemindersToggle = page.getByLabel(/event reminders/i)

    // Actions
    this.saveButton = page.getByRole('button', { name: /save/i })
    this.cancelButton = page.getByRole('button', { name: /cancel/i })
    this.closeButton = page
      .getByRole('button', { name: /close/i })
      .or(page.locator('[aria-label*="Close"]'))
  }

  /**
   * Open General settings tab
   */
  async openGeneralSettings() {
    await this.generalTab.click()
  }

  /**
   * Open Appearance settings tab
   */
  async openAppearanceSettings() {
    await this.appearanceTab.click()
  }

  /**
   * Open Calendar settings tab
   */
  async openCalendarSettings() {
    await this.calendarTab.click()
  }

  /**
   * Open Notifications settings tab
   */
  async openNotificationsSettings() {
    await this.notificationsTab.click()
  }

  /**
   * Change theme
   */
  async changeTheme(theme: 'light' | 'dark' | 'system') {
    await this.openAppearanceSettings()

    const option =
      theme === 'light'
        ? this.lightModeOption
        : theme === 'dark'
          ? this.darkModeOption
          : this.systemModeOption

    await this.themeSelect.click()
    await option.click()
  }

  /**
   * Toggle dark mode
   */
  async toggleDarkMode() {
    await this.openAppearanceSettings()
    await this.darkModeToggle.click()
  }

  /**
   * Set default calendar view
   */
  async setDefaultView(view: 'day' | 'week' | 'month' | 'agenda') {
    await this.openCalendarSettings()
    await this.defaultViewSelect.click()
    await this.page.getByRole('option', { name: new RegExp(view, 'i') }).click()
  }

  /**
   * Toggle show weekends
   */
  async toggleShowWeekends() {
    await this.openCalendarSettings()
    await this.showWeekendsToggle.click()
  }

  /**
   * Toggle show week numbers
   */
  async toggleShowWeekNumbers() {
    await this.openCalendarSettings()
    await this.showWeekNumbersToggle.click()
  }

  /**
   * Toggle email notifications
   */
  async toggleEmailNotifications() {
    await this.openNotificationsSettings()
    await this.emailNotificationsToggle.click()
  }

  /**
   * Change timezone
   */
  async changeTimezone(timezone: string) {
    await this.openGeneralSettings()
    await this.timezoneSelect.click()
    await this.page.getByRole('option', { name: new RegExp(timezone, 'i') }).click()
  }

  /**
   * Change week start day
   */
  async changeWeekStart(day: 'Sunday' | 'Monday') {
    await this.openGeneralSettings()
    await this.weekStartSelect.click()
    await this.page.getByRole('option', { name: day }).click()
  }

  /**
   * Save settings
   */
  async save() {
    await this.saveButton.click()
    await this.page.waitForTimeout(500)
  }

  /**
   * Cancel changes
   */
  async cancel() {
    await this.cancelButton.click()
  }

  /**
   * Close settings modal
   */
  async close() {
    await this.closeButton.click()
  }

  /**
   * Verify theme is applied
   */
  async verifyTheme(theme: 'light' | 'dark') {
    const htmlElement = this.page.locator('html')
    const classList = await htmlElement.getAttribute('class')

    if (theme === 'dark') {
      expect(classList).toContain('dark')
    } else {
      expect(classList).not.toContain('dark')
    }
  }
}
