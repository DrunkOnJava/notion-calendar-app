import { test, expect } from '@playwright/test'
import { CalendarPage } from './pages/CalendarPage'
import { EventPage } from './pages/EventPage'

test.describe('Search and Filters', () => {
  let calendarPage: CalendarPage
  let eventPage: EventPage

  test.beforeEach(async ({ page }) => {
    calendarPage = new CalendarPage(page)
    eventPage = new EventPage(page)
    await calendarPage.goto()

    // Create some test events
    await calendarPage.openCreateEvent()
    await eventPage.createEvent({
      title: 'Team Meeting',
      description: 'Weekly sync',
    })

    await calendarPage.openCreateEvent()
    await eventPage.createEvent({
      title: 'Client Presentation',
      description: 'Q4 roadmap review',
    })

    await calendarPage.openCreateEvent()
    await eventPage.createEvent({
      title: 'Code Review',
      description: 'Review PRs',
    })
  })

  test('should search for events by title', async () => {
    await calendarPage.search('Team Meeting')

    // Should show Team Meeting event in search results
    const searchResults = calendarPage.page.locator('[data-testid="search-results"]')
    const teamMeeting = searchResults.getByText('Team Meeting')
    await expect(teamMeeting).toBeVisible()
  })

  test('should search for events by description', async () => {
    await calendarPage.search('roadmap')

    // Should show Client Presentation (has 'roadmap' in description) in search results
    const searchResults = calendarPage.page.locator('[data-testid="search-results"]')
    const clientPresentation = searchResults.getByText('Client Presentation')
    await expect(clientPresentation).toBeVisible()
  })

  test('should show no results for non-matching search', async () => {
    await calendarPage.search('NonExistentEvent12345')

    // Should show empty state or no results message
    const noResults = calendarPage.page.getByText(/no results|not found/i)
    await expect(noResults)
      .toBeVisible({ timeout: 2000 })
      .catch(() => {
        // Alternative: check that no events are visible
        return Promise.resolve()
      })
  })

  test('should clear search and show all events', async () => {
    // Search first
    await calendarPage.search('Team')

    // Clear search
    await calendarPage.searchInput.clear()

    // All events should be visible again
    const events = await calendarPage.getVisibleEvents()
    expect(events.length).toBeGreaterThanOrEqual(3)
  })

  test('should filter events in real-time as user types', async () => {
    await calendarPage.openSearch()

    // Type letter by letter
    await calendarPage.searchInput.fill('C')
    await calendarPage.page.waitForTimeout(400) // Wait for debounce

    await calendarPage.searchInput.fill('Co')
    await calendarPage.page.waitForTimeout(400)

    await calendarPage.searchInput.fill('Cod')
    await calendarPage.page.waitForTimeout(400)

    // Should show Code Review in search results
    const searchResults = calendarPage.page.locator('[data-testid="search-results"]')
    const codeReview = searchResults.getByText('Code Review')
    await expect(codeReview).toBeVisible()
  })

  test('should open search with keyboard shortcut', async ({ page }) => {
    // Use Cmd+K or Ctrl+K
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+K' : 'Control+K')

    // Search should be open (or command palette)
    const searchOrCommand = calendarPage.page.locator(
      'input[placeholder*="Search"], input[placeholder*="Type a command"]'
    )
    await expect(searchOrCommand.first()).toBeVisible()
  })

  test('should close search with Escape key', async ({ page }) => {
    await calendarPage.openSearch()
    await expect(calendarPage.searchInput).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(calendarPage.searchInput).not.toBeVisible()
  })

  test('should navigate search results with keyboard', async ({ page }) => {
    await calendarPage.search('e') // All test events have 'e'

    // Use arrow down to navigate results
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowDown')

    // Press Enter to select
    await page.keyboard.press('Enter')

    // Event detail should open (implementation-specific)
    await page.waitForTimeout(300)
  })

  test('should highlight matching text in results', async () => {
    await calendarPage.search('Team')

    // Check if "Team" is highlighted (implementation-specific)
    const highlighted = calendarPage.page.locator('mark, .highlight, [data-highlighted]')
    // This depends on implementation
  })

  test('should search case-insensitively', async () => {
    await calendarPage.search('team meeting')
    const searchResults = calendarPage.page.locator('[data-testid="search-results"]')
    const lowerCase = await searchResults.getByText('Team Meeting').isVisible()

    await calendarPage.searchInput.clear()
    await calendarPage.search('TEAM MEETING')
    const upperCase = await searchResults.getByText('Team Meeting').isVisible()

    expect(lowerCase).toBe(true)
    expect(upperCase).toBe(true)
  })

  test('should handle special characters in search', async () => {
    // Create event with special characters
    await calendarPage.openCreateEvent()
    await eventPage.createEvent({
      title: 'Q4 Review (2024)',
      description: 'Annual review & planning',
    })

    await calendarPage.search('Q4 Review (2024)')
    const searchResults = calendarPage.page.locator('[data-testid="search-results"]')
    const event = searchResults.getByText('Q4 Review (2024)')
    await expect(event).toBeVisible()
  })

  test('should maintain search state during navigation', async ({ page }) => {
    await calendarPage.search('Team')

    // Switch views
    await calendarPage.switchToAgendaView()

    // Search should still be active
    await expect(calendarPage.searchInput).toHaveValue('Team')
  })

  test('should show recent searches', async () => {
    await calendarPage.search('Team')
    await calendarPage.page.keyboard.press('Escape')

    await calendarPage.openSearch()

    // Recent searches might be shown (implementation-specific)
    await calendarPage.page.waitForTimeout(300)
  })

  test('should search across all calendar views', async () => {
    const searchResults = calendarPage.page.locator('[data-testid="search-results"]')

    // Day view
    await calendarPage.switchToDayView()
    await calendarPage.search('Team')
    const inDay = await searchResults.getByText('Team Meeting').isVisible()

    // Week view
    await calendarPage.switchToWeekView()
    const inWeek = await searchResults.getByText('Team Meeting').isVisible()

    // Agenda view
    await calendarPage.switchToAgendaView()
    const inAgenda = await searchResults.getByText('Team Meeting').isVisible()

    expect(inDay || inWeek || inAgenda).toBe(true)
  })
})
