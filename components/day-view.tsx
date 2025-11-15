'use client'

import type React from 'react'

import { cn } from '@/lib/utils'
import { ResizableEvent } from '@/components/resizable-event'

interface DayViewProps {
  currentDate: Date
  events: any[]
  onEventClick: (event: any) => void
  onTimeSlotClick: (date: Date, time: string) => void
  onEventResize?: (event: any, newStartTime: string, newEndTime: string) => void
  onEventRightClick?: (e: React.MouseEvent, event: any) => void
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
    const dateStr = currentDate.toISOString().split('T')[0]
    return events.filter((event) => {
      if (event.date !== dateStr) return false
      if (event.isAllDay) return hour === 0
      const eventHour = Number.parseInt(event.startTime?.split(':')[0] || '0')
      return eventHour === hour
    })
  }

  const getEventDuration = (event: any) => {
    if (!event.startTime || !event.endTime) return 1
    const [startHour, startMin] = event.startTime.split(':').map(Number)
    const [endHour, endMin] = event.endTime.split(':').map(Number)
    const durationMinutes = endHour * 60 + endMin - (startHour * 60 + startMin)
    return durationMinutes / 60
  }

  const getEventTopOffset = (event: any) => {
    if (!event.startTime) return 0
    const [hour, minutes] = event.startTime.split(':').map(Number)
    return (minutes / 60) * 100
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-w-[800px]">
        {/* Date Header */}
        <div className="sticky top-0 z-10 border-b border-[#2a2a2a] bg-[#1a1a1a] p-6">
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-[#6b6b6b]">
              {currentDate.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div
              className={cn(
                'text-3xl font-semibold',
                currentDate.toDateString() === new Date().toDateString()
                  ? 'bg-today text-today-foreground flex h-12 w-12 items-center justify-center rounded-full'
                  : 'text-[#d0d0d0]'
              )}
            >
              {currentDate.getDate()}
            </div>
            <div className="text-sm text-[#9a9a9a]">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
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
                <div className="flex h-20 items-start justify-end border-r border-[#2a2a2a] p-4 text-right text-sm text-[#6b6b6b]">
                  {hour === 0
                    ? '12 AM'
                    : hour < 12
                      ? `${hour} AM`
                      : hour === 12
                        ? '12 PM'
                        : `${hour - 12} PM`}
                </div>

                {/* Time Slot */}
                <div
                  onClick={() =>
                    onTimeSlotClick(currentDate, `${hour.toString().padStart(2, '0')}:00`)
                  }
                  className="relative h-20 cursor-pointer border-b border-[#2a2a2a] p-2 hover:bg-[#202020]"
                >
                  {hourEvents.map((event, eventIdx) => {
                    const duration = getEventDuration(event)
                    const topOffset = getEventTopOffset(event)

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
                        className="absolute right-2 left-2"
                      >
                        <div
                          className={cn(
                            'h-full cursor-pointer rounded px-3 py-2 text-sm',
                            event.color && `bg-[${event.color}]/60`,
                            !event.color &&
                              event.type === 'holiday' &&
                              'bg-event-holiday/40 text-success-foreground',
                            !event.color &&
                              event.type === 'info' &&
                              'bg-muted text-muted-foreground',
                            !event.color && !event.type && 'bg-event-default/80 text-foreground'
                          )}
                          style={event.color ? { backgroundColor: `${event.color}99` } : undefined}
                        >
                          <div className="font-medium">{event.title}</div>
                          {event.startTime && event.endTime && (
                            <div className="mt-1 text-xs opacity-80">
                              {event.startTime} - {event.endTime}
                            </div>
                          )}
                          {event.location && (
                            <div className="mt-0.5 text-xs opacity-70">📍 {event.location}</div>
                          )}
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
