"use client"
import { Clock, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TimeSlot {
  start: string
  end: string
}

interface DayAvailability {
  enabled: boolean
  slots: TimeSlot[]
}

interface WeekAvailability {
  [key: string]: DayAvailability
}

interface AvailabilityEditorProps {
  availability: WeekAvailability
  onChange: (availability: WeekAvailability) => void
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function AvailabilityEditor({ availability, onChange }: AvailabilityEditorProps) {
  const toggleDay = (day: string) => {
    onChange({
      ...availability,
      [day]: {
        ...availability[day],
        enabled: !availability[day].enabled,
      },
    })
  }

  const addTimeSlot = (day: string) => {
    onChange({
      ...availability,
      [day]: {
        ...availability[day],
        slots: [...availability[day].slots, { start: "09:00", end: "17:00" }],
      },
    })
  }

  const removeTimeSlot = (day: string, index: number) => {
    onChange({
      ...availability,
      [day]: {
        ...availability[day],
        slots: availability[day].slots.filter((_, i) => i !== index),
      },
    })
  }

  const updateTimeSlot = (day: string, index: number, field: "start" | "end", value: string) => {
    onChange({
      ...availability,
      [day]: {
        ...availability[day],
        slots: availability[day].slots.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)),
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-info" />
        <h3 className="text-sm font-semibold text-foreground">Weekly Availability</h3>
      </div>

      {DAYS.map((day) => (
        <div key={day} className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleDay(day)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  availability[day]?.enabled ? "bg-info" : "bg-muted"
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    availability[day]?.enabled ? "translate-x-5" : ""
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-foreground">{day}</span>
            </div>

            {availability[day]?.enabled && (
              <Button onClick={() => addTimeSlot(day)} variant="outline" size="sm" className="text-xs">
                <Plus className="w-3 h-3 mr-1" />
                Add Hours
              </Button>
            )}
          </div>

          {availability[day]?.enabled && (
            <div className="space-y-2">
              {availability[day].slots.map((slot, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="time"
                    value={slot.start}
                    onChange={(e) => updateTimeSlot(day, index, "start", e.target.value)}
                    className="px-3 py-2 bg-input border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-info"
                  />
                  <span className="text-muted-foreground">to</span>
                  <input
                    type="time"
                    value={slot.end}
                    onChange={(e) => updateTimeSlot(day, index, "end", e.target.value)}
                    className="px-3 py-2 bg-input border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-info"
                  />
                  <button
                    onClick={() => removeTimeSlot(day, index)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {availability[day].slots.length === 0 && (
                <p className="text-sm text-muted-foreground italic">Click "Add Hours" to set available times</p>
              )}
            </div>
          )}

          {!availability[day]?.enabled && <p className="text-sm text-muted-foreground italic">Unavailable</p>}
        </div>
      ))}
    </div>
  )
}
