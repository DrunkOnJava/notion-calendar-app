'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useState } from 'react'

interface DatePickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectDate: (date: Date) => void
  initialDate?: Date
}

export function DatePickerModal({
  isOpen,
  onClose,
  onSelectDate,
  initialDate,
}: DatePickerModalProps) {
  const [currentMonth, setCurrentMonth] = useState(initialDate || new Date())
  const [input, setInput] = useState('')

  if (!isOpen) return null

  const parseNaturalLanguage = (text: string): Date | null => {
    const lower = text.toLowerCase().trim()
    const today = new Date()

    if (lower === 'today') {
      return today
    }
    if (lower === 'tomorrow') {
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      return tomorrow
    }
    if (lower === 'yesterday') {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      return yesterday
    }

    // next monday, next tuesday, etc.
    const nextDayMatch = lower.match(
      /^next\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/
    )
    if (nextDayMatch) {
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      const targetDay = days.indexOf(nextDayMatch[1])
      const result = new Date(today)
      const currentDay = result.getDay()
      const daysUntil = (targetDay + 7 - currentDay) % 7 || 7
      result.setDate(result.getDate() + daysUntil)
      return result
    }

    // in X days
    const inDaysMatch = lower.match(/^in\s+(\d+)\s+days?$/)
    if (inDaysMatch) {
      const result = new Date(today)
      result.setDate(result.getDate() + Number.parseInt(inDaysMatch[1]))
      return result
    }

    // X days ago
    const daysAgoMatch = lower.match(/^(\d+)\s+days?\s+ago$/)
    if (daysAgoMatch) {
      const result = new Date(today)
      result.setDate(result.getDate() - Number.parseInt(daysAgoMatch[1]))
      return result
    }

    // specific date formats (mm/dd/yyyy, dec 25, december 25 2025, etc.)
    const parsedDate = new Date(text)
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate
    }

    return null
  }

  const handleInputSubmit = () => {
    const parsed = parseNaturalLanguage(input)
    if (parsed) {
      onSelectDate(parsed)
      onClose()
    }
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const daysInPrevMonth = getDaysInMonth(new Date(year, month - 1, 1))

  const calendarDays = []

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, daysInPrevMonth - i),
    })
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(year, month, i),
    })
  }

  // Next month days
  const remainingDays = 42 - calendarDays.length
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i),
    })
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[400px] rounded-lg bg-[#1c1c1c] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <CalendarIcon className="h-5 w-5" />
            Jump to date
          </h2>
          <button onClick={onClose} className="rounded p-1.5 hover:bg-[#2a2a2a]">
            <X className="h-5 w-5 text-[#6b6b6b]" />
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder='Try "tomorrow", "next monday", "dec 25"...'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
            className="w-full rounded border border-[#3a3a3a] bg-[#2a2a2a] px-3 py-2 text-sm outline-none placeholder:text-[#6b6b6b] focus:border-blue-500"
            autoFocus
          />
          <div className="mt-1 text-xs text-[#6b6b6b]">
            Examples: today, tomorrow, next friday, in 3 days, dec 25
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <button onClick={previousMonth} className="rounded p-1.5 hover:bg-[#2a2a2a]">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h3 className="text-sm font-medium">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <button onClick={nextMonth} className="rounded p-1.5 hover:bg-[#2a2a2a]">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="mb-1 text-center text-xs font-medium text-[#6b6b6b]">
                {day}
              </div>
            ))}
            {calendarDays.map((day, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelectDate(day.date)
                  onClose()
                }}
                className={cn(
                  'flex aspect-square items-center justify-center rounded text-sm hover:bg-[#2a2a2a]',
                  !day.isCurrentMonth && 'text-[#4a4a4a]',
                  day.isCurrentMonth && 'text-[#d0d0d0]',
                  isToday(day.date) && 'bg-info text-info-foreground hover:bg-info/90 font-semibold'
                )}
              >
                {day.day}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            onClick={() => {
              onSelectDate(new Date())
              onClose()
            }}
            variant="outline"
            className="flex-1"
          >
            Today
          </Button>
          <Button onClick={onClose} variant="ghost" className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
