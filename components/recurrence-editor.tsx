'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface RecurrenceEditorProps {
  value?: RecurrenceRule
  onChange: (rule: RecurrenceRule | null) => void
  onClose: () => void
}

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number
  endType: 'never' | 'count' | 'until'
  count?: number
  until?: string
  byWeekday?: number[] // 0-6 for Sun-Sat
  byMonthDay?: number
  byMonth?: number
  exceptions?: string[] // dates to skip
}

export function RecurrenceEditor({ value, onChange, onClose }: RecurrenceEditorProps) {
  const [rule, setRule] = useState<RecurrenceRule>(
    value || {
      frequency: 'weekly',
      interval: 1,
      endType: 'never',
      byWeekday: [],
    }
  )

  const handleFrequencyChange = (frequency: RecurrenceRule['frequency']) => {
    setRule({ ...rule, frequency, byWeekday: frequency === 'weekly' ? [] : undefined })
  }

  const handleIntervalChange = (interval: number) => {
    setRule({ ...rule, interval: Math.max(1, interval) })
  }

  const handleWeekdayToggle = (day: number) => {
    const current = rule.byWeekday || []
    const newDays = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day].sort()
    setRule({ ...rule, byWeekday: newDays })
  }

  const handleEndTypeChange = (endType: RecurrenceRule['endType']) => {
    setRule({ ...rule, endType })
  }

  const handleSave = () => {
    onChange(rule)
    onClose()
  }

  const handleRemove = () => {
    onChange(null)
    onClose()
  }

  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const weekdayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[500px] rounded-lg bg-[#1c1c1c] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Custom recurrence</h2>
          <button onClick={onClose} className="rounded p-1 hover:bg-[#2a2a2a]">
            <X className="h-4 w-4 text-[#6b6b6b]" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Frequency */}
          <div>
            <label className="mb-2 block text-sm text-[#9a9a9a]">Repeat every</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={rule.interval}
                onChange={(e) => handleIntervalChange(Number(e.target.value))}
                className="w-16 rounded border border-[#3a3a3a] bg-[#2a2a2a] px-3 py-2 text-sm"
              />
              <select
                value={rule.frequency}
                onChange={(e) =>
                  handleFrequencyChange(e.target.value as RecurrenceRule['frequency'])
                }
                className="flex-1 rounded border border-[#3a3a3a] bg-[#2a2a2a] px-3 py-2 text-sm"
              >
                <option value="daily">{rule.interval === 1 ? 'Day' : 'Days'}</option>
                <option value="weekly">{rule.interval === 1 ? 'Week' : 'Weeks'}</option>
                <option value="monthly">{rule.interval === 1 ? 'Month' : 'Months'}</option>
                <option value="yearly">{rule.interval === 1 ? 'Year' : 'Years'}</option>
              </select>
            </div>
          </div>

          {/* Weekly options */}
          {rule.frequency === 'weekly' && (
            <div>
              <label className="mb-2 block text-sm text-[#9a9a9a]">Repeat on</label>
              <div className="flex gap-2">
                {weekdays.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleWeekdayToggle(idx)}
                    className={cn(
                      'h-10 w-10 rounded-full text-sm font-medium transition-colors',
                      rule.byWeekday?.includes(idx)
                        ? 'bg-info text-info-foreground'
                        : 'bg-[#2a2a2a] text-[#9a9a9a] hover:bg-[#3a3a3a]'
                    )}
                    title={weekdayNames[idx]}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Monthly options */}
          {rule.frequency === 'monthly' && (
            <div>
              <label className="mb-2 block text-sm text-[#9a9a9a]">Repeat on day</label>
              <input
                type="number"
                min="1"
                max="31"
                value={rule.byMonthDay || 1}
                onChange={(e) => setRule({ ...rule, byMonthDay: Number(e.target.value) })}
                className="w-20 rounded border border-[#3a3a3a] bg-[#2a2a2a] px-3 py-2 text-sm"
              />
            </div>
          )}

          {/* End options */}
          <div>
            <label className="mb-2 block text-sm text-[#9a9a9a]">Ends</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={rule.endType === 'never'}
                  onChange={() => handleEndTypeChange('never')}
                  className="h-4 w-4"
                />
                <span className="text-sm">Never</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={rule.endType === 'count'}
                  onChange={() => handleEndTypeChange('count')}
                  className="h-4 w-4"
                />
                <span className="text-sm">After</span>
                <input
                  type="number"
                  min="1"
                  value={rule.count || 1}
                  onChange={(e) => setRule({ ...rule, count: Number(e.target.value) })}
                  disabled={rule.endType !== 'count'}
                  className="w-20 rounded border border-[#3a3a3a] bg-[#2a2a2a] px-3 py-2 text-sm disabled:opacity-50"
                />
                <span className="text-sm">occurrences</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={rule.endType === 'until'}
                  onChange={() => handleEndTypeChange('until')}
                  className="h-4 w-4"
                />
                <span className="text-sm">On</span>
                <input
                  type="date"
                  value={rule.until || ''}
                  onChange={(e) => setRule({ ...rule, until: e.target.value })}
                  disabled={rule.endType !== 'until'}
                  className="rounded border border-[#3a3a3a] bg-[#2a2a2a] px-3 py-2 text-sm disabled:opacity-50"
                />
              </label>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded bg-[#2a2a2a] p-4">
            <div className="mb-1 text-xs text-[#9a9a9a]">Summary</div>
            <div className="text-sm">{getRecurrenceSummary(rule)}</div>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          {value && (
            <Button onClick={handleRemove} variant="outline" className="flex-1 bg-transparent">
              Remove recurrence
            </Button>
          )}
          <Button
            onClick={handleSave}
            className="bg-info hover:bg-info/90 text-info-foreground flex-1"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}

export function generateRecurringDates(
  startDate: string,
  rule: RecurrenceRule,
  maxOccurrences = 365
): string[] {
  const dates: string[] = []
  const start = new Date(startDate + 'T00:00:00')
  const current = new Date(start)
  let count = 0

  const until = rule.until ? new Date(rule.until + 'T23:59:59') : null
  const maxCount = rule.endType === 'count' ? rule.count || 1 : maxOccurrences

  while (count < maxCount) {
    const dateStr = current.toISOString().split('T')[0]

    // Check if this date should be included
    let include = true

    if (rule.frequency === 'weekly' && rule.byWeekday && rule.byWeekday.length > 0) {
      include = rule.byWeekday.includes(current.getDay())
    }

    if (include && (!rule.exceptions || !rule.exceptions.includes(dateStr))) {
      if (until && current > until) {
        break
      }
      dates.push(dateStr)
      count++
    }

    // Increment date
    switch (rule.frequency) {
      case 'daily':
        current.setDate(current.getDate() + rule.interval)
        break
      case 'weekly':
        current.setDate(current.getDate() + 1)
        if (rule.byWeekday && rule.byWeekday.length > 0) {
          // Skip to next matching weekday
          while (!rule.byWeekday.includes(current.getDay())) {
            current.setDate(current.getDate() + 1)
          }
        }
        break
      case 'monthly':
        current.setMonth(current.getMonth() + rule.interval)
        break
      case 'yearly':
        current.setFullYear(current.getFullYear() + rule.interval)
        break
    }

    // Safety check
    if (dates.length > 1000) break
  }

  return dates
}

function getRecurrenceSummary(rule: RecurrenceRule): string {
  let summary = `Every ${rule.interval > 1 ? rule.interval + ' ' : ''}`

  switch (rule.frequency) {
    case 'daily':
      summary += rule.interval === 1 ? 'day' : 'days'
      break
    case 'weekly':
      summary += rule.interval === 1 ? 'week' : 'weeks'
      if (rule.byWeekday && rule.byWeekday.length > 0) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        summary += ' on ' + rule.byWeekday.map((d) => days[d]).join(', ')
      }
      break
    case 'monthly':
      summary += rule.interval === 1 ? 'month' : 'months'
      if (rule.byMonthDay) {
        summary += ` on day ${rule.byMonthDay}`
      }
      break
    case 'yearly':
      summary += rule.interval === 1 ? 'year' : 'years'
      break
  }

  if (rule.endType === 'count') {
    summary += `, ${rule.count} times`
  } else if (rule.endType === 'until') {
    summary += `, until ${rule.until}`
  }

  return summary
}
