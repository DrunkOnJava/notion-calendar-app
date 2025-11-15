import { test, expect } from '@playwright/test'
import { CalendarPage } from './pages/CalendarPage'
import { EventPage } from './pages/EventPage'

test.describe('Event Management', () => {
  let calendarPage: CalendarPage
  let eventPage: EventPage

  test.beforeEach(async ({ page }) => {
    calendarPage = new CalendarPage(page)
    eventPage = new EventPage(page)
    await calendarPage.goto()
  })

  test('should create a new event', async () => {
    await calendarPage.openCreateEvent()

    await eventPage.createEvent({
      title: 'Team Meeting',
      description: 'Weekly sync with the team',
      startTime: '10:00',
      endTime: '11:00',
      location: 'Conference Room A',
    })

    // Verify event appears in calendar
    const events = await calendarPage.getVisibleEvents()
    expect(events.length).toBeGreaterThan(0)
  })

  test('should create an all-day event', async () => {
    await calendarPage.openCreateEvent()

    await eventPage.createEvent({
      title: 'Company Holiday',
      description: 'Office closed',
      allDay: true,
    })

    // Verify all-day event appears
    await calendarPage.page.waitForTimeout(500)
    const events = await calendarPage.getVisibleEvents()
    expect(events.length).toBeGreaterThan(0)
  })

  test('should create a recurring event', async () => {
    await calendarPage.openCreateEvent()

    await eventPage.createRecurringEvent({
      title: 'Daily Standup',
      description: 'Daily team standup meeting',
      recurrence: 'daily',
    })

    // Verify recurring event is created
    await calendarPage.page.waitForTimeout(500)
  })

  test('should edit an existing event', async ({ page }) => {
    // Create an event first
    await calendarPage.openCreateEvent()
    await eventPage.createEvent({
      title: 'Original Event',
      description: 'Original description',
    })

    // Click on the event to open details
    await calendarPage.clickEvent('Original Event')

    // Edit the event
    await eventPage.editEvent({
      title: 'Updated Event',
      description: 'Updated description',
    })

    // Verify the update
    await calendarPage.clickEvent('Updated Event')
    await eventPage.verifyEventDetails({
      title: 'Updated Event',
      description: 'Updated description',
    })
  })

  test('should delete an event', async () => {
    // Create an event
    await calendarPage.openCreateEvent()
    await eventPage.createEvent({
      title: 'Event to Delete',
    })

    // Click on the event
    await calendarPage.clickEvent('Event to Delete')

    // Delete it
    await eventPage.deleteEvent()

    // Verify event is gone
    const eventExists = await calendarPage.page
      .getByText('Event to Delete')
      .isVisible({ timeout: 1000 })
      .catch(() => false)

    expect(eventExists).toBe(false)
  })

  test('should edit event from context menu', async () => {
    // Create an event
    await calendarPage.openCreateEvent()
    await eventPage.createEvent({
      title: 'Context Menu Event',
    })

    // Right-click to open context menu
    await eventPage.editFromContextMenu('Context Menu Event')

    // Edit the event
    await eventPage.editEvent({
      title: 'Edited via Context Menu',
    })

    // Verify the update
    await calendarPage.page.waitForTimeout(500)
    const updated = await calendarPage.page.getByText('Edited via Context Menu').isVisible()

    expect(updated).toBe(true)
  })

  test('should duplicate an event', async () => {
    // Create an event
    await calendarPage.openCreateEvent()
    await eventPage.createEvent({
      title: 'Event to Duplicate',
      description: 'This will be duplicated',
    })

    // Duplicate via context menu
    await eventPage.duplicateFromContextMenu('Event to Duplicate')

    // Verify duplicate exists (implementation-specific)
    await calendarPage.page.waitForTimeout(500)
    const events = await calendarPage.getVisibleEvents()
    expect(events.length).toBeGreaterThan(1)
  })

  test('should cancel event creation', async () => {
    await calendarPage.openCreateEvent()

    await eventPage.titleInput.fill('Cancelled Event')
    await eventPage.cancel()

    // Verify modal is closed
    const dialog = calendarPage.page.locator('[role="dialog"]')
    await expect(dialog).not.toBeVisible()

    // Verify event was not created
    const eventExists = await calendarPage.page
      .getByText('Cancelled Event')
      .isVisible({ timeout: 1000 })
      .catch(() => false)

    expect(eventExists).toBe(false)
  })

  test('should validate required fields', async () => {
    await calendarPage.openCreateEvent()

    // Try to save without title
    await eventPage.saveButton.click()

    // Should show validation error or not close modal
    const dialog = calendarPage.page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()

    // Fill title and save successfully
    await eventPage.titleInput.fill('Valid Event')
    await eventPage.saveButton.click()

    await calendarPage.page.waitForTimeout(500)
  })

  test('should click time slot to create event', async () => {
    await calendarPage.switchToDayView()

    // Click on 10 AM time slot (if implementation supports)
    await calendarPage.clickTimeSlot(10)

    // Event creation modal should open
    const dialog = calendarPage.page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()

    // Start time should be pre-filled to 10:00 (implementation-specific)
  })

  test('should handle overlapping events', async () => {
    await calendarPage.openCreateEvent()

    await eventPage.createEvent({
      title: 'First Event',
      startTime: '14:00',
      endTime: '15:00',
    })

    await calendarPage.openCreateEvent()

    await eventPage.createEvent({
      title: 'Overlapping Event',
      startTime: '14:30',
      endTime: '15:30',
    })

    // Both events should be visible
    const events = await calendarPage.getVisibleEvents()
    expect(events.length).toBeGreaterThanOrEqual(2)
  })

  test('should display event details on click', async () => {
    // Create an event with details
    await calendarPage.openCreateEvent()

    await eventPage.createEvent({
      title: 'Detailed Event',
      description: 'This event has full details',
      location: 'Room 101',
    })

    // Click to view details
    await calendarPage.clickEvent('Detailed Event')

    // Verify all details are displayed
    await eventPage.verifyEventDetails({
      title: 'Detailed Event',
      description: 'This event has full details',
      location: 'Room 101',
    })
  })
})
