/**
 * Test data fixtures for E2E tests
 */

export const testEvents = {
  simple: {
    title: 'Simple Event',
    description: 'A basic test event',
  },
  withTime: {
    title: 'Timed Event',
    description: 'Event with specific time',
    startTime: '14:00',
    endTime: '15:00',
  },
  allDay: {
    title: 'All Day Event',
    description: 'Full day event',
    allDay: true,
  },
  withLocation: {
    title: 'Event with Location',
    description: 'Event at specific location',
    location: 'Conference Room B',
    startTime: '09:00',
    endTime: '10:00',
  },
  recurring: {
    title: 'Recurring Event',
    description: 'Repeating event',
    recurrence: 'weekly' as const,
  },
  longDescription: {
    title: 'Event with Long Description',
    description:
      'This is a very long description that contains multiple sentences. It should test how the application handles longer text content. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  specialChars: {
    title: 'Special Event (Q4)',
    description: 'Testing & special characters: @#$%',
  },
}

export const testSettings = {
  darkTheme: {
    theme: 'dark' as const,
  },
  lightTheme: {
    theme: 'light' as const,
  },
  systemTheme: {
    theme: 'system' as const,
  },
  weekView: {
    defaultView: 'week' as const,
  },
  dayView: {
    defaultView: 'day' as const,
  },
  agendaView: {
    defaultView: 'agenda' as const,
  },
}

export const testUsers = {
  default: {
    name: 'Test User',
    email: '[email protected]',
    timezone: 'America/New_York',
  },
  european: {
    name: 'EU Test User',
    email: '[email protected]',
    timezone: 'Europe/London',
  },
  asian: {
    name: 'Asia Test User',
    email: '[email protected]',
    timezone: 'Asia/Tokyo',
  },
}

export const searchQueries = {
  simple: 'meeting',
  caseInsensitive: 'TEAM',
  partial: 'pres',
  withSpecialChars: 'Q4 (2024)',
  noResults: 'NonExistentEvent12345',
}

/**
 * Helper to generate random event data
 */
export function generateRandomEvent() {
  const randomTitle = `Test Event ${Math.floor(Math.random() * 10000)}`
  return {
    title: randomTitle,
    description: `Description for ${randomTitle}`,
    startTime: `${Math.floor(Math.random() * 12) + 8}:00`, // 8 AM to 7 PM
    endTime: `${Math.floor(Math.random() * 12) + 9}:00`,
  }
}

/**
 * Helper to generate multiple events
 */
export function generateMultipleEvents(count: number) {
  return Array.from({ length: count }, () => generateRandomEvent())
}

/**
 * Date helpers for testing
 */
export const testDates = {
  today: new Date(),
  tomorrow: new Date(Date.now() + 24 * 60 * 60 * 1000),
  yesterday: new Date(Date.now() - 24 * 60 * 60 * 1000),
  nextWeek: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  lastWeek: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
}

/**
 * Browser viewport sizes for responsive testing
 */
export const viewports = {
  mobile: { width: 375, height: 667 }, // iPhone SE
  tablet: { width: 768, height: 1024 }, // iPad
  desktop: { width: 1920, height: 1080 }, // Full HD
  ultrawide: { width: 2560, height: 1440 }, // QHD
}
