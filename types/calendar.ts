// Shared type definitions for the calendar application

export interface Event {
  id: string
  date: string
  title: string
  type?: string
  time?: string
  startTime?: string
  endTime?: string
  seriesId?: string
  recurrence?: RecurrenceRule
  color?: string
  calendar?: string
  [key: string]: unknown
}

export interface RecurrenceRule {
  frequency: "daily" | "weekly" | "monthly" | "yearly"
  interval?: number
  endDate?: string
  count?: number
  [key: string]: unknown
}

export interface DatabaseItem {
  id: string
  name: string
  time?: string
  properties?: Record<string, unknown>
  [key: string]: unknown
}

export interface Filter {
  property: string
  operator: string
  value: unknown
}
