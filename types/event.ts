/**
 * Recurrence rule for recurring events
 */
export interface RecurrenceRule {
  frequency: "daily" | "weekly" | "monthly" | "yearly"
  interval: number
  endType: "never" | "count" | "until"
  count?: number
  until?: string // YYYY-MM-DD format
  byWeekday?: number[] // 0-6 for Sun-Sat
  byMonthDay?: number
  byMonth?: number
  exceptions?: string[] // YYYY-MM-DD format
}

/**
 * Calendar event interface
 */
export interface Event {
  // Required
  id: string
  date: string // YYYY-MM-DD
  title: string

  // Time & Schedule (Optional)
  startTime?: string | null // HH:MM (24-hour)
  endTime?: string | null // HH:MM (24-hour)
  isAllDay?: boolean
  timezone?: string
  time?: string | null // Display time (legacy)

  // Organization (Optional)
  calendar?: string
  color?: string // Hex code
  tags?: string[]
  type?: "holiday" | "info"

  // Event Details (Optional)
  description?: string
  location?: string
  videoLink?: string
  attendees?: string[]
  reminders?: string[]

  // Status & Priority (Optional)
  status?: "confirmed" | "tentative" | "cancelled"
  priority?: "low" | "medium" | "high"
  visibility?: "public" | "private" | "confidential"

  // Recurrence & Metadata (Optional)
  recurrence?: RecurrenceRule | null
  seriesId?: string
  attachments?: string[]
  createdAt?: string // ISO 8601
}
