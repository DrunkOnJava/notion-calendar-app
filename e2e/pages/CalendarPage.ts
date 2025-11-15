import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * Page Object for Calendar main page
 */
export class CalendarPage extends BasePage {
  // View Switcher
  readonly viewSwitcher: Locator
  readonly dayViewButton: Locator
  readonly weekViewButton: Locator
  readonly agendaViewButton: Locator

  // Calendar Grid
  readonly calendarGrid: Locator
  readonly timeSlots: Locator

  // Search
  readonly searchButton: Locator
  readonly searchInput: Locator

  // Command Palette
  readonly commandPaletteButton: Locator

  // Event Creation
  readonly createEventButton: Locator

  // Settings
  readonly settingsButton: Locator

  // Notifications
  readonly notificationBell: Locator

  constructor(page: Page) {
    super(page)

    // Initialize locators
    this.viewSwitcher = page.locator('[data-testid="view-switcher"]')
    this.dayViewButton = page.locator('[data-testid="view-day"]')
    this.weekViewButton = page.locator('[data-testid="view-week"]')
    this.agendaViewButton = page.locator('[data-testid="view-agenda"]')

    this.calendarGrid = page.locator('[data-testid="calendar-grid"]')
    this.timeSlots = page.locator('[data-testid="time-slot"]').or(
      page.locator('.time-slot')
    )

    this.searchButton = page.locator('[data-testid="search-bar"]')
    this.searchInput = page.locator('[data-testid="search-input"]')

    this.commandPaletteButton = page.getByRole('button', { name: /command/i })

    this.createEventButton = page.locator('[data-testid="new-event-button"]')

    this.settingsButton = page.locator('[data-testid="settings-button"]')

    this.notificationBell = page.getByRole('button', { name: /notification/i })
  }

  /**
   * Navigate to calendar page
   */
  async goto() {
    await this.page.goto('/')
    await this.waitForLoad()
  }

  /**
   * Switch to Day view
   */
  async switchToDayView() {
    // Click view switcher to open dropdown
    await this.viewSwitcher.locator('[data-testid="view-switcher-button"]').click()
    // Click day view option
    await this.dayViewButton.click()
    await this.page.waitForTimeout(300) // Wait for view transition
  }

  /**
   * Switch to Week view
   */
  async switchToWeekView() {
    // Click view switcher to open dropdown
    await this.viewSwitcher.locator('[data-testid="view-switcher-button"]').click()
    // Click week view option
    await this.weekViewButton.click()
    await this.page.waitForTimeout(300)
  }

  /**
   * Switch to Agenda view
   */
  async switchToAgendaView() {
    // Click view switcher to open dropdown
    await this.viewSwitcher.locator('[data-testid="view-switcher-button"]').click()
    // Click agenda view option
    await this.agendaViewButton.click()
    await this.page.waitForTimeout(300)
  }

  /**
   * Click on a time slot to create an event
   */
  async clickTimeSlot(hour: number) {
    const timeSlot = this.page.locator(`[data-hour="${hour}"]`).or(
      this.timeSlots.nth(hour)
    )
    await timeSlot.click()
  }

  /**
   * Open search
   */
  async openSearch() {
    await this.searchInput.click()
    await expect(this.searchInput).toBeFocused()
  }

  /**
   * Search for events
   */
  async search(query: string) {
    await this.searchInput.click()
    await this.searchInput.fill(query)
    await this.page.waitForTimeout(300) // Wait for search debounce
  }

  /**
   * Open command palette (Cmd+K)
   */
  async openCommandPalette() {
    await this.page.keyboard.press(process.platform === 'darwin' ? 'Meta+K' : 'Control+K')
    await this.page.waitForSelector('[role="dialog"]', { state: 'visible' })
  }

  /**
   * Open event creation modal
   */
  async openCreateEvent() {
    await this.createEventButton.click()
    await this.page.waitForSelector('[role="dialog"]', { state: 'visible' })
  }

  /**
   * Open settings
   */
  async openSettings() {
    await this.settingsButton.click()
    await this.page.waitForSelector('[role="dialog"]', { state: 'visible' })
  }

  /**
   * Get all visible events
   */
  async getVisibleEvents() {
    return this.page.locator('[data-testid="calendar-event"]').or(
      this.page.locator('.calendar-event, .event-item')
    ).all()
  }

  /**
   * Click on an event by title
   */
  async clickEvent(title: string) {
    // Wait a moment for events to render after creation
    await this.page.waitForTimeout(500)

    // Try multiple strategies to find the event
    const event = this.page.getByText(title, { exact: false }).first()
      .or(this.page.locator(`[data-event-title="${title}"]`))
      .or(this.page.locator('[data-testid="calendar-event"]').filter({ hasText: title }))

    // Wait for event to be visible before clicking
    await event.waitFor({ state: 'visible', timeout: 5000 })
    await event.click()
  }

  /**
   * Navigate to today
   */
  async goToToday() {
    const todayButton = this.page.locator('[data-testid="today-button"]')
    await todayButton.click()
  }

  /**
   * Navigate to next period (day/week)
   */
  async navigateNext() {
    const nextButton = this.page.locator('[data-testid="next-button"]')
    await nextButton.click()
  }

  /**
   * Navigate to previous period (day/week)
   */
  async navigatePrevious() {
    const prevButton = this.page.locator('[data-testid="previous-button"]')
    await prevButton.click()
  }

  /**
   * Check if view is currently active
   */
  async isViewActive(view: 'day' | 'week' | 'agenda'): Promise<boolean> {
    // Check the data-view attribute on the calendar grid
    const calendarGrid = this.page.locator('[data-testid="calendar-grid"]')
    const dataView = await calendarGrid.getAttribute('data-view')

    return dataView === view
  }
}
