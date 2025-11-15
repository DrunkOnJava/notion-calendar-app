"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { ResizableEvent } from "@/components/resizable-event"
import type { Event } from "@/types/calendar"

interface DayViewProps {
  currentDate: Date
  events: Event[]
  onEventClick: (event: Event) => void
  onTimeSlotClick: (date: Date, time: string) => void
  onEventResize?: (event: Event, newStartTime: string, newEndTime: string) => void
  onEventRightClick?: (e: React.MouseEvent, event: Event) => void
}

export function DayView({
  currentDate,
  events,
  onEventClick,
  onTimeSlotClick,
  onEventResize,
  onEventRightClick,
}: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const getEventsForHour = (hour: number) => {
    const dateStr = currentDate.toISOString().split("T")[0]
    return events.filter((event) => {
      if (event.date !== dateStr) return false
      if (event.isAllDay) return hour === 0
      const eventHour = Number.parseInt(event.startTime?.split(":")[0] || "0")
      return eventHour === hour
    })
  }

  const getEventDuration = (event: Event) => {
    if (!event.startTime || !event.endTime) return 1
    const [startHour, startMin] = event.startTime.split(":").map(Number)
    const [endHour, endMin] = event.endTime.split(":").map(Number)
    const durationMinutes = endHour * 60 + endMin - (startHour * 60 + startMin)
    return durationMinutes / 60
  }

  const getEventTopOffset = (event: Event) => {
    if (!event.startTime) return 0
    const [_hour, minutes] = event.startTime.split(":").map(Number)
    return (minutes / 60) * 100
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-w-[800px]">
        {/* Date Header */}
        <div className="border-b border-[#2a2a2a] sticky top-0 bg-[#1a1a1a] z-10 p-6">
          <div className="flex items-center gap-4">
            <div className="text-[#6b6b6b] text-sm font-medium">
              {currentDate.toLocaleDateString("en-US", { weekday: "short" })}
            </div>
            <div
              className={cn(
                "text-3xl font-semibold",
                currentDate.toDateString() === new Date().toDateString()
                  ? "bg-today text-today-foreground w-12 h-12 rounded-full flex items-center justify-center"
                  : "text-[#d0d0d0]",
              )}
            >
              {currentDate.getDate()}
            </div>
            <div className="text-sm text-[#9a9a9a]">
              {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </div>
          </div>
        </div>

        {/* Time Grid */}
        <div className="grid grid-cols-[100px_1fr]">
          {hours.map((hour) => {
            const hourEvents = getEventsForHour(hour)
            return (
              <div key={hour} className="contents">
                {/* Time Label */}
                <div className="p-4 text-sm text-[#6b6b6b] text-right border-r border-[#2a2a2a] h-20 flex items-start justify-end">
                  {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                </div>

                {/* Time Slot */}
                <div
                  onClick={() => onTimeSlotClick(currentDate, `${hour.toString().padStart(2, "0")}:00`)}
                  className="border-b border-[#2a2a2a] h-20 hover:bg-[#202020] cursor-pointer relative p-2"
                >
                  {hourEvents.map((event, eventIdx) => {
                    const _duration = getEventDuration(event)
                    const _topOffset = getEventTopOffset(event)

                    return (
                      <ResizableEvent
                        key={eventIdx}
                        event={event}
                        onResize={(e, newStart, newEnd) => {
                          onEventResize?.(e, newStart, newEnd)
                        }}
                        onClick={onEventClick}
                        onContextMenu={onEventRightClick}
                        timeSlotHeight={80}
                        className="absolute left-2 right-2"
                      >
                        <div
                          className={cn(
                            "h-full px-3 py-2 text-sm rounded cursor-pointer",
                            event.color && `bg-[${event.color}]/60`,
                            !event.color && event.type === "holiday" && "bg-event-holiday/40 text-success-foreground",
                            !event.color && event.type === "info" && "bg-muted text-muted-foreground",
                            !event.color && !event.type && "bg-event-default/80 text-foreground",
                          )}
                          style={event.color ? { backgroundColor: `${event.color}99` } : undefined}
                        >
                          <div className="font-medium">{event.title}</div>
                          {event.startTime && event.endTime && (
                            <div className="text-xs opacity-80 mt-1">
                              {event.startTime} - {event.endTime}
                            </div>
                          )}
                          {event.location && <div className="text-xs opacity-70 mt-0.5">📍 {event.location}</div>}
                        </div>
                      </ResizableEvent>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
