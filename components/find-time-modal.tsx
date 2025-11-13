"use client"

import { useState } from "react"
import { X, Search, Clock, Users, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FindTimeModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectTime: (date: Date, startTime: string, endTime: string) => void
  events: any[]
  weeklyAvailability: any
}

export function FindTimeModal({ isOpen, onClose, onSelectTime, events, weeklyAvailability }: FindTimeModalProps) {
  const [duration, setDuration] = useState(30)
  const [attendees, setAttendees] = useState<string[]>([])
  const [newAttendee, setNewAttendee] = useState("")
  const [dateRange, setDateRange] = useState(7) // Days to look ahead
  const [suggestedTimes, setSuggestedTimes] = useState<any[]>([])

  const findAvailableTimes = () => {
    const suggestions: any[] = []
    const now = new Date()
    const endDate = new Date(now)
    endDate.setDate(endDate.getDate() + dateRange)

    // Iterate through each day in the range
    for (let d = new Date(now); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayName = d.toLocaleDateString("en-US", { weekday: "long" })
      const dayAvailability = weeklyAvailability[dayName]

      if (!dayAvailability || !dayAvailability.enabled) continue

      // Check each availability slot for this day
      dayAvailability.slots.forEach((slot: { start: string; end: string }) => {
        const [startHour, startMin] = slot.start.split(":").map(Number)
        const [endHour, endMin] = slot.end.split(":").map(Number)

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
          const dateStr = currentTime.toISOString().split("T")[0]
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
      setNewAttendee("")
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-info" />
            <h2 className="text-lg font-semibold text-foreground">Find Time</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Meeting Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Meeting Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-info"
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
                <label className="block text-sm text-muted-foreground mb-2">Search Next</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-info"
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
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Attendees (Optional)
            </h3>

            <div className="flex gap-2">
              <input
                type="email"
                value={newAttendee}
                onChange={(e) => setNewAttendee(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddAttendee()}
                placeholder="Add attendee email"
                className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-info"
              />
              <Button onClick={handleAddAttendee} variant="outline">
                Add
              </Button>
            </div>

            {attendees.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attendees.map((email) => (
                  <div key={email} className="flex items-center gap-2 bg-surface px-3 py-1 rounded-full text-sm">
                    <span className="text-foreground">{email}</span>
                    <button
                      onClick={() => handleRemoveAttendee(email)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Find Times Button */}
          <Button onClick={findAvailableTimes} className="w-full bg-info hover:bg-info/90">
            <Search className="w-4 h-4 mr-2" />
            Find Available Times
          </Button>

          {/* Suggested Times */}
          {suggestedTimes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Suggested Times ({suggestedTimes.length})
              </h3>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {suggestedTimes.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectTime(suggestion)}
                    className="w-full flex items-center justify-between p-4 bg-surface hover:bg-surface-hover border border-border rounded-lg transition-colors"
                  >
                    <div className="text-left">
                      <div className="text-sm font-medium text-foreground">
                        {suggestion.date.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {suggestion.startTime} - {suggestion.endTime} ({duration} min)
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-success/20 text-success text-xs rounded-full">Available</span>
                      <span className="text-muted-foreground">→</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {suggestedTimes.length === 0 && (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Click "Find Available Times" to see suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
