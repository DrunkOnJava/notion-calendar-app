// Re-export types from event.ts for backwards compatibility
export type { Event, RecurrenceRule } from './event'

export interface DatabaseItem {
  id: string
  name: string
  time?: string
  properties?: Record<string, unknown>
  [key: string]: unknown
}

export interface Filter {
  property: string
  operator: 'is' | 'is-not' | 'contains' | 'greater' | 'less'
  value: string
}
