"use client"

import { useState } from "react"
import { X, CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DatePickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectDate: (date: Date) => void
  initialDate?: Date
}

export function DatePickerModal({ isOpen, onClose, onSelectDate, initialDate }: DatePickerModalProps) {
  const [currentMonth, setCurrentMonth] = useState(initialDate || new Date())
  const [input, setInput] = useState("")

  if (!isOpen) return null

  const parseNaturalLanguage = (text: string): Date | null => {
    const lower = text.toLowerCase().trim()
    const today = new Date()

    if (lower === "today") {
      return today
    }
    if (lower === "tomorrow") {
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      return tomorrow
    }
    if (lower === "yesterday") {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      return yesterday
    }

    // next monday, next tuesday, etc.
    const nextDayMatch = lower.match(/^next\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/)
    if (nextDayMatch) {
      const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
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
    try {
      const parsedDate = new Date(text)
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate
      }
    } catch {}

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1c1c1c] rounded-lg w-[400px] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Jump to date
          </h2>
          <button onClick={onClose} className="hover:bg-[#2a2a2a] p-1.5 rounded">
            <X className="w-5 h-5 text-[#6b6b6b]" />
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder='Try "tomorrow", "next monday", "dec 25"...'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInputSubmit()}
            className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-sm outline-none focus:border-blue-500 placeholder:text-[#6b6b6b]"
            autoFocus
          />
          <div className="text-xs text-[#6b6b6b] mt-1">Examples: today, tomorrow, next friday, in 3 days, dec 25</div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <button onClick={previousMonth} className="hover:bg-[#2a2a2a] p-1.5 rounded">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-medium">
              {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h3>
            <button onClick={nextMonth} className="hover:bg-[#2a2a2a] p-1.5 rounded">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div key={day} className="text-center text-xs text-[#6b6b6b] font-medium mb-1">
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
                  "aspect-square flex items-center justify-center rounded text-sm hover:bg-[#2a2a2a]",
                  !day.isCurrentMonth && "text-[#4a4a4a]",
                  day.isCurrentMonth && "text-[#d0d0d0]",
                  isToday(day.date) && "bg-info text-info-foreground font-semibold hover:bg-info/90",
                )}
              >
                {day.day}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mt-4">
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
