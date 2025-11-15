import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * Page Object for Event Creation and Detail Modal
 */
export class EventPage extends BasePage {
  // Event Form Fields
  readonly titleInput: Locator
  readonly descriptionInput: Locator
  readonly startDateInput: Locator
  readonly startTimeInput: Locator
  readonly endDateInput: Locator
  readonly endTimeInput: Locator
  readonly locationInput: Locator
  readonly allDayCheckbox: Locator

  // Recurrence
  readonly recurrenceButton: Locator
  readonly recurrenceSelect: Locator

  // Actions
  readonly saveButton: Locator
  readonly cancelButton: Locator
  readonly deleteButton: Locator
  readonly closeButton: Locator

  // Event Detail
  readonly eventTitle: Locator
  readonly eventDescription: Locator
  readonly eventTime: Locator
  readonly eventLocation: Locator

  // Context Menu
  readonly editMenuItem: Locator
  readonly deleteMenuItem: Locator
  readonly duplicateMenuItem: Locator

  constructor(page: Page) {
    super(page)

    // Form inputs - using data-testid for stable selectors
    this.titleInput = page.locator('[data-testid="event-title-input"]')
    this.descriptionInput = page.locator('[data-testid="event-description-input"]')
    this.startDateInput = page.locator('[data-testid="event-date-input"]')
    this.startTimeInput = page.locator('[data-testid="event-start-time-input"]')
    this.endDateInput = page.locator('[data-testid="event-date-input"]') // Same as start date
    this.endTimeInput = page.locator('[data-testid="event-end-time-input"]')
    this.locationInput = page.locator('[data-testid="event-location-input"]')
    this.allDayCheckbox = page.locator('[data-testid="event-all-day-checkbox"]')

    // Recurrence
    this.recurrenceButton = page.locator('[data-testid="event-recurrence-select"]')
    this.recurrenceSelect = page.locator('[data-testid="event-recurrence-select"]')

    // Actions
    this.saveButton = page.locator('[data-testid="event-save-button"]')
    this.cancelButton = page.locator('[data-testid="event-cancel-button"]')
    this.deleteButton = page.getByRole('button', { name: /delete/i })
    this.closeButton = page.getByRole('button', { name: /close/i })

    // Event detail view
    this.eventTitle = page
      .locator('[data-testid="event-title"]')
      .or(page.locator('.event-title, h2'))
    this.eventDescription = page
      .locator('[data-testid="event-description"]')
      .or(page.locator('.event-description'))
    this.eventTime = page.locator('[data-testid="event-time"]')
    this.eventLocation = page.locator('[data-testid="event-location"]')

    // Context menu items
    this.editMenuItem = page.getByRole('menuitem', { name: /edit/i })
    this.deleteMenuItem = page.getByRole('menuitem', { name: /delete/i })
    this.duplicateMenuItem = page.getByRole('menuitem', { name: /duplicate/i })
  }

  /**
   * Create a new event with basic details
   */
  async createEvent(data: {
    title: string
    description?: string
    date?: string // Optional date in YYYY-MM-DD format, defaults to today
    startTime?: string
    endTime?: string
    location?: string
    allDay?: boolean
  }) {
    await this.titleInput.fill(data.title)

    // Fill date (required field) - default to today if not provided
    const eventDate = data.date || new Date().toISOString().split('T')[0]
    await this.startDateInput.fill(eventDate)
    // Trigger change event for React controlled component
    await this.startDateInput.dispatchEvent('change')
    await this.startDateInput.dispatchEvent('blur')

    if (data.description) {
      await this.descriptionInput.fill(data.description)
    }

    if (data.startTime) {
      await this.startTimeInput.fill(data.startTime)
    }

    if (data.endTime) {
      await this.endTimeInput.fill(data.endTime)
    }

    if (data.location) {
      await this.locationInput.fill(data.location)
    }

    if (data.allDay) {
      await this.allDayCheckbox.check()
    }

    // Wait for button to be enabled before clicking
    await this.saveButton.waitFor({ state: 'visible' })
    await this.page.waitForTimeout(200) // Brief wait for form validation
    await this.saveButton.click()
    await this.page.waitForTimeout(500) // Wait for save
  }

  /**
   * Create a recurring event
   */
  async createRecurringEvent(data: {
    title: string
    description?: string
    date?: string // Optional date, defaults to today
    recurrence: 'daily' | 'weekly' | 'monthly'
  }) {
    await this.titleInput.fill(data.title)

    // Fill date (required field) - default to today
    const eventDate = data.date || new Date().toISOString().split('T')[0]
    await this.startDateInput.fill(eventDate)
    // Trigger change event for React controlled component
    await this.startDateInput.dispatchEvent('change')
    await this.startDateInput.dispatchEvent('blur')

    if (data.description) {
      await this.descriptionInput.fill(data.description)
    }

    await this.recurrenceButton.click()
    await this.page.getByRole('option', { name: new RegExp(data.recurrence, 'i') }).click()

    // Wait for button to be enabled
    await this.saveButton.waitFor({ state: 'visible' })
    await this.page.waitForTimeout(200)
    await this.saveButton.click()
    await this.page.waitForTimeout(500)
  }

  /**
   * Edit an existing event
   */
  async editEvent(updates: { title?: string; description?: string; location?: string }) {
    if (updates.title) {
      await this.titleInput.clear()
      await this.titleInput.fill(updates.title)
    }

    if (updates.description) {
      await this.descriptionInput.clear()
      await this.descriptionInput.fill(updates.description)
    }

    if (updates.location) {
      await this.locationInput.clear()
      await this.locationInput.fill(updates.location)
    }

    await this.saveButton.click()
    await this.page.waitForTimeout(500)
  }

  /**
   * Delete the current event
   */
  async deleteEvent() {
    await this.deleteButton.click()

    // Confirm deletion if dialog appears
    const confirmButton = this.page.getByRole('button', { name: /confirm|delete/i })
    if (await confirmButton.isVisible({ timeout: 1000 })) {
      await confirmButton.click()
    }

    await this.page.waitForTimeout(500)
  }

  /**
   * Cancel event creation/editing
   */
  async cancel() {
    await this.cancelButton.click()
  }

  /**
   * Close event detail modal
   */
  async close() {
    await this.closeButton.click()
  }

  /**
   * Verify event details
   */
  async verifyEventDetails(expected: { title?: string; description?: string; location?: string }) {
    if (expected.title) {
      await expect(this.eventTitle).toContainText(expected.title)
    }

    if (expected.description) {
      await expect(this.eventDescription).toContainText(expected.description)
    }

    if (expected.location) {
      await expect(this.eventLocation).toContainText(expected.location)
    }
  }

  /**
   * Open event context menu
   */
  async openContextMenu(eventTitle: string) {
    const event = this.page.getByText(eventTitle).first()
    await event.click({ button: 'right' })
    await this.page.waitForSelector('[role="menu"]', { state: 'visible' })
  }

  /**
   * Edit event from context menu
   */
  async editFromContextMenu(eventTitle: string) {
    await this.openContextMenu(eventTitle)
    await this.editMenuItem.click()
    await this.page.waitForSelector('[role="dialog"]', { state: 'visible' })
  }

  /**
   * Delete event from context menu
   */
  async deleteFromContextMenu(eventTitle: string) {
    await this.openContextMenu(eventTitle)
    await this.deleteMenuItem.click()

    // Confirm deletion
    const confirmButton = this.page.getByRole('button', { name: /confirm|delete/i })
    if (await confirmButton.isVisible({ timeout: 1000 })) {
      await confirmButton.click()
    }
  }

  /**
   * Duplicate event from context menu
   */
  async duplicateFromContextMenu(eventTitle: string) {
    await this.openContextMenu(eventTitle)
    await this.duplicateMenuItem.click()
    await this.page.waitForTimeout(500)
  }
}
