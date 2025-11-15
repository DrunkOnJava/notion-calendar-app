/**
 * Accessibility utility functions
 * Helpers for improving screen reader support and ARIA attributes
 */

/**
 * Announce content to screen readers
 */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Generate unique IDs for ARIA relationships
 */
let idCounter = 0
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${++idCounter}`
}

/**
 * Format date for screen readers
 */
export function formatDateForScreenReader(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/**
 * Format time for screen readers
 */
export function formatTimeForScreenReader(time: string): string {
  // Convert 24h to 12h with AM/PM
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12

  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

/**
 * Create ARIA label for calendar views
 */
export function createViewLabel(
  view: 'day' | 'week' | 'month' | 'agenda',
  date: Date
): string {
  const dateStr = formatDateForScreenReader(date)

  switch (view) {
    case 'day':
      return `Day view, ${dateStr}`
    case 'week':
      return `Week view, week of ${dateStr}`
    case 'month':
      return `Month view, ${new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date)}`
    case 'agenda':
      return `Agenda view`
    default:
      return `Calendar view`
  }
}

/**
 * Create ARIA label for event
 */
export function createEventLabel(event: {
  title: string
  date: Date | string
  time?: string
  location?: string
}): string {
  const parts = [event.title]

  if (event.date) {
    const date = typeof event.date === 'string' ? new Date(event.date) : event.date
    parts.push(`on ${formatDateForScreenReader(date)}`)
  }

  if (event.time) {
    parts.push(`at ${formatTimeForScreenReader(event.time)}`)
  }

  if (event.location) {
    parts.push(`at ${event.location}`)
  }

  return parts.join(', ')
}

/**
 * Visually hidden class for screen reader only content
 */
export const visuallyHidden = `
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
