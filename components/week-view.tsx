'use client'

import type React from 'react'

import { cn } from '@/lib/utils'
import { ResizableEvent } from '@/components/resizable-event'
import type { Event } from '@/types/calendar'

interface WeekViewProps {
  currentDate: Date
  events: Event[]
  onEventClick: (event: Event) => void
  onTimeSlotClick: (date: Date, time: string) => void
  onEventResize?: (event: Event, newStartTime: string, newEndTime: string) => void
  onEventRightClick?: (e: React.MouseEvent, event: Event) => void
}

export function WeekView({
  currentDate,
  events,
  onEventClick,
  onTimeSlotClick,
  onEventResize,
  onEventRightClick,
}: WeekViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const weekStart = new Date(currentDate)
  weekStart.setDate(currentDate.getDate() - currentDate.getDay())

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart)
    day.setDate(weekStart.getDate() + i)
    return day
  })

  const getEventsForDateTime = (date: Date, hour: number) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter((event) => {
      if (event.date !== dateStr) return false
      if (event.isAllDay) return hour === 0
      const eventHour = Number.parseInt(event.startTime?.split(':')[0] || '0')
      return eventHour === hour
    })
  }

  const getEventDuration = (event: Event) => {
    if (!event.startTime || !event.endTime) return 1
    const [startHour, startMin] = event.startTime.split(':').map(Number)
    const [endHour, endMin] = event.endTime.split(':').map(Number)
    const durationMinutes = endHour * 60 + endMin - (startHour * 60 + startMin)
    return durationMinutes / 60
  }

  const getEventTopOffset = (event: Event) => {
    if (!event.startTime) return 0
    const [_hour, minutes] = event.startTime.split(':').map(Number)
    return (minutes / 60) * 100
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-w-[1200px]">
        {/* Header */}
        <div className="sticky top-0 z-10 grid grid-cols-[60px_repeat(7,1fr)] border-b border-[#2a2a2a] bg-[#1a1a1a]">
          <div className="p-2"></div>
          {weekDays.map((day, idx) => (
            <div key={idx} className="border-l border-[#2a2a2a] p-2 text-center">
              <div className="text-xs font-medium text-[#6b6b6b]">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div
                className={cn(
                  'mt-1 text-xl font-semibold',
                  day.toDateString() === new Date().toDateString()
                    ? 'bg-today text-today-foreground mx-auto flex h-10 w-10 items-center justify-center rounded-full'
                    : 'text-[#d0d0d0]'
                )}
              >
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Time Grid */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)]">
          {hours.map((hour) => (
            <div key={hour} className="contents">
              {/* Time Label */}
              <div className="flex h-16 items-start justify-end border-r border-[#2a2a2a] p-2 text-right text-xs text-[#6b6b6b]">
                {hour === 0
                  ? '12 AM'
                  : hour < 12
                    ? `${hour} AM`
                    : hour === 12
                      ? '12 PM'
                      : `${hour - 12} PM`}
              </div>

              {/* Day Columns */}
              {weekDays.map((day, dayIdx) => {
                const dayEvents = getEventsForDateTime(day, hour)
                return (
                  <div
                    key={dayIdx}
                    onClick={() => onTimeSlotClick(day, `${hour.toString().padStart(2, '0')}:00`)}
                    className="relative h-16 cursor-pointer border-b border-l border-[#2a2a2a] p-1 hover:bg-[#202020]"
                  >
                    {dayEvents.map((event, eventIdx) => {
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
                          timeSlotHeight={64}
                          className="absolute right-1 left-1"
                        >
                          <div
                            className={cn(
                              'h-full cursor-pointer rounded px-2 py-1 text-xs',
                              event.color && `bg-[${event.color}]/60`,
                              !event.color &&
                                event.type === 'holiday' &&
                                'bg-event-holiday/40 text-success-foreground',
                              !event.color &&
                                event.type === 'info' &&
                                'bg-muted text-muted-foreground',
                              !event.color && !event.type && 'bg-event-default/80 text-foreground'
                            )}
                            style={
                              event.color ? { backgroundColor: `${event.color}99` } : undefined
                            }
                          >
                            <div className="truncate font-medium">{event.title}</div>
                            {event.startTime && (
                              <div className="text-[10px] opacity-80">
                                {event.startTime} - {event.endTime || 'No end'}
                              </div>
                            )}
                          </div>
                        </ResizableEvent>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
