'use client'

import { useState } from 'react'
import { X, Search, Clock, Users, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FindTimeModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectTime: (date: Date, startTime: string, endTime: string) => void
  events: any[]
  weeklyAvailability: any
}

export function FindTimeModal({
  isOpen,
  onClose,
  onSelectTime,
  events,
  weeklyAvailability,
}: FindTimeModalProps) {
  const [duration, setDuration] = useState(30)
  const [attendees, setAttendees] = useState<string[]>([])
  const [newAttendee, setNewAttendee] = useState('')
  const [dateRange, setDateRange] = useState(7) // Days to look ahead
  const [suggestedTimes, setSuggestedTimes] = useState<any[]>([])

  const findAvailableTimes = () => {
    const suggestions: any[] = []
    const now = new Date()
    const endDate = new Date(now)
    endDate.setDate(endDate.getDate() + dateRange)

    // Iterate through each day in the range
    for (let d = new Date(now); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' })
      const dayAvailability = weeklyAvailability[dayName]

      if (!dayAvailability || !dayAvailability.enabled) continue

      // Check each availability slot for this day
      dayAvailability.slots.forEach((slot: { start: string; end: string }) => {
        const [startHour, startMin] = slot.start.split(':').map(Number)
        const [endHour, endMin] = slot.end.split(':').map(Number)

        // Generate time slots within availability window
        const currentTime = new Date(d)
        currentTime.setHours(startHour, startMin, 0, 0)
        const slotEnd = new Date(d)
        slotEnd.setHours(endHour, endMin, 0, 0)

        while (currentTime < slotEnd) {
          const proposedEnd = new Date(currentTime)
          proposedEnd.setMinutes(proposedEnd.getMinutes() + duration)

          if (proposedEnd > slotEnd) break

          // Check if this time conflicts with existing events
          const dateStr = currentTime.toISOString().split('T')[0]
          const timeStr = currentTime.toTimeString().slice(0, 5)
          const endTimeStr = proposedEnd.toTimeString().slice(0, 5)

          const hasConflict = events.some((event) => {
            if (event.date !== dateStr) return false
            if (!event.startTime || !event.endTime) return false

            const eventStart = event.startTime
            const eventEnd = event.endTime

            return (
              (timeStr >= eventStart && timeStr < eventEnd) ||
              (endTimeStr > eventStart && endTimeStr <= eventEnd) ||
              (timeStr <= eventStart && endTimeStr >= eventEnd)
            )
          })

          if (!hasConflict && currentTime > now) {
            suggestions.push({
              date: new Date(currentTime),
              startTime: timeStr,
              endTime: endTimeStr,
              dateStr,
            })

            // Limit to 10 suggestions
            if (suggestions.length >= 10) {
              setSuggestedTimes(suggestions)
              return
            }
          }

          // Move to next 15-minute slot
          currentTime.setMinutes(currentTime.getMinutes() + 15)
        }
      })
    }

    setSuggestedTimes(suggestions)
  }

  const handleAddAttendee = () => {
    if (newAttendee && !attendees.includes(newAttendee)) {
      setAttendees([...attendees, newAttendee])
      setNewAttendee('')
    }
  }

  const handleRemoveAttendee = (email: string) => {
    setAttendees(attendees.filter((a) => a !== email))
  }

  const handleSelectTime = (suggestion: any) => {
    onSelectTime(suggestion.date, suggestion.startTime, suggestion.endTime)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border-border max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border">
        <div className="bg-card border-border sticky top-0 flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <Search className="text-info h-5 w-5" />
            <h2 className="text-foreground text-lg font-semibold">Find Time</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Meeting Details */}
          <div className="space-y-4">
            <h3 className="text-foreground flex items-center gap-2 text-sm font-semibold">
              <Clock className="h-4 w-4" />
              Meeting Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-muted-foreground mb-2 block text-sm">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="bg-input border-border text-foreground focus:ring-info w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>

              <div>
                <label className="text-muted-foreground mb-2 block text-sm">Search Next</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(Number(e.target.value))}
                  className="bg-input border-border text-foreground focus:ring-info w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none"
                >
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                  <option value={60}>60 days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Attendees */}
          <div className="space-y-4">
            <h3 className="text-foreground flex items-center gap-2 text-sm font-semibold">
              <Users className="h-4 w-4" />
              Attendees (Optional)
            </h3>

            <div className="flex gap-2">
              <input
                type="email"
                value={newAttendee}
                onChange={(e) => setNewAttendee(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddAttendee()}
                placeholder="Add attendee email"
                className="bg-input border-border text-foreground placeholder-muted-foreground focus:ring-info flex-1 rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none"
              />
              <Button onClick={handleAddAttendee} variant="outline">
                Add
              </Button>
            </div>

            {attendees.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attendees.map((email) => (
                  <div
                    key={email}
                    className="bg-surface flex items-center gap-2 rounded-full px-3 py-1 text-sm"
                  >
                    <span className="text-foreground">{email}</span>
                    <button
                      onClick={() => handleRemoveAttendee(email)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Find Times Button */}
          <Button onClick={findAvailableTimes} className="bg-info hover:bg-info/90 w-full">
            <Search className="mr-2 h-4 w-4" />
            Find Available Times
          </Button>

          {/* Suggested Times */}
          {suggestedTimes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-foreground flex items-center gap-2 text-sm font-semibold">
                <Calendar className="h-4 w-4" />
                Suggested Times ({suggestedTimes.length})
              </h3>

              <div className="max-h-96 space-y-2 overflow-y-auto">
                {suggestedTimes.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectTime(suggestion)}
                    className="bg-surface hover:bg-surface-hover border-border flex w-full items-center justify-between rounded-lg border p-4 transition-colors"
                  >
                    <div className="text-left">
                      <div className="text-foreground text-sm font-medium">
                        {suggestion.date.toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="text-muted-foreground mt-1 text-xs">
                        {suggestion.startTime} - {suggestion.endTime} ({duration} min)
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-success/20 text-success rounded-full px-3 py-1 text-xs">
                        Available
                      </span>
                      <span className="text-muted-foreground">→</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {suggestedTimes.length === 0 && (
            <div className="py-8 text-center">
              <Clock className="text-muted-foreground mx-auto mb-3 h-12 w-12" />
              <p className="text-muted-foreground text-sm">
                Click "Find Available Times" to see suggestions
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
