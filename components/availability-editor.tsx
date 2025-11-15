'use client'
import { Clock, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

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
        slots: [...availability[day].slots, { start: '09:00', end: '17:00' }],
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

  const updateTimeSlot = (day: string, index: number, field: 'start' | 'end', value: string) => {
    onChange({
      ...availability,
      [day]: {
        ...availability[day],
        slots: availability[day].slots.map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot
        ),
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center gap-2">
        <Clock className="text-info h-4 w-4" />
        <h3 className="text-foreground text-sm font-semibold">Weekly Availability</h3>
      </div>

      {DAYS.map((day) => (
        <div key={day} className="border-border rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleDay(day)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  availability[day]?.enabled ? 'bg-info' : 'bg-muted'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${
                    availability[day]?.enabled ? 'translate-x-5' : ''
                  }`}
                />
              </button>
              <span className="text-foreground text-sm font-medium">{day}</span>
            </div>

            {availability[day]?.enabled && (
              <Button
                onClick={() => addTimeSlot(day)}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <Plus className="mr-1 h-3 w-3" />
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
                    onChange={(e) => updateTimeSlot(day, index, 'start', e.target.value)}
                    className="bg-input border-border text-foreground focus:ring-info rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                  />
                  <span className="text-muted-foreground">to</span>
                  <input
                    type="time"
                    value={slot.end}
                    onChange={(e) => updateTimeSlot(day, index, 'end', e.target.value)}
                    className="bg-input border-border text-foreground focus:ring-info rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                  />
                  <button
                    onClick={() => removeTimeSlot(day, index)}
                    className="text-destructive hover:bg-destructive/10 rounded p-2 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {availability[day].slots.length === 0 && (
                <p className="text-muted-foreground text-sm italic">
                  Click "Add Hours" to set available times
                </p>
              )}
            </div>
          )}

          {!availability[day]?.enabled && (
            <p className="text-muted-foreground text-sm italic">Unavailable</p>
          )}
        </div>
      ))}
    </div>
  )
}
