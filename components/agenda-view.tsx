'use client'

import { cn } from '@/lib/utils'
import { MapPin, Users, Video } from 'lucide-react'
import type { Event } from '@/types/calendar'

interface AgendaViewProps {
  currentDate: Date
  events: Event[]
  onEventClick: (event: Event) => void
}

export function AgendaView({ currentDate, events, onEventClick }: AgendaViewProps) {
  // Get events for the next 30 days
  const endDate = new Date(currentDate)
  endDate.setDate(endDate.getDate() + 30)

  // Group events by date
  const groupedEvents: { [key: string]: Event[] } = {}
  const dateRange: Date[] = []

  for (let d = new Date(currentDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0]
    dateRange.push(new Date(d))
    groupedEvents[dateStr] = events.filter((event) => event.date === dateStr)
  }

  const sortedDates = Object.keys(groupedEvents)
    .filter((date) => groupedEvents[date].length > 0)
    .sort()

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-[900px] p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-semibold">Agenda</h2>
          <p className="text-sm text-[#9a9a9a]">
            {currentDate.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}{' '}
            -
            {endDate.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>

        {sortedDates.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mb-2 text-lg text-[#6b6b6b]">No upcoming events</div>
            <p className="text-sm text-[#9a9a9a]">Your calendar is clear for the next 30 days</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map((dateStr) => {
              const date = new Date(dateStr + 'T00:00:00')
              const dayEvents = groupedEvents[dateStr]
              const isToday = date.toDateString() === new Date().toDateString()

              return (
                <div key={dateStr} className="border-l-2 border-[#2a2a2a] pl-6">
                  {/* Date Header */}
                  <div className="mb-4 -ml-[29px] flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-12 w-12 flex-col items-center justify-center rounded-full',
                        isToday ? 'bg-today text-today-foreground' : 'bg-[#2a2a2a] text-[#d0d0d0]'
                      )}
                    >
                      <div className="text-xs font-medium">
                        {date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                      </div>
                      <div className="text-lg font-bold">{date.getDate()}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#d0d0d0]">
                        {date.toLocaleDateString('en-US', { weekday: 'long' })}
                      </div>
                      <div className="text-xs text-[#9a9a9a]">
                        {date.toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Events for this date */}
                  <div className="space-y-3">
                    {dayEvents.map((event, idx) => (
                      <div
                        key={idx}
                        onClick={() => onEventClick(event)}
                        className="cursor-pointer rounded-lg border border-[#2a2a2a] bg-[#1c1c1c] p-4 transition-colors hover:bg-[#252525]"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div className="flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <div
                                className={cn(
                                  'h-8 w-1 rounded-full',
                                  event.type === 'holiday'
                                    ? 'bg-success'
                                    : event.type === 'info'
                                      ? 'bg-muted-foreground'
                                      : 'bg-info'
                                )}
                              ></div>
                              <div>
                                <h3 className="text-sm font-semibold text-[#d0d0d0]">
                                  {event.title}
                                </h3>
                                {event.isAllDay ? (
                                  <div className="text-xs text-[#9a9a9a]">All day</div>
                                ) : event.startTime && event.endTime ? (
                                  <div className="text-xs text-[#9a9a9a]">
                                    {event.startTime} - {event.endTime}
                                  </div>
                                ) : event.time ? (
                                  <div className="text-xs text-[#9a9a9a]">{event.time}</div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          {event.type && (
                            <span
                              className={cn(
                                'rounded px-2 py-1 text-xs',
                                event.type === 'holiday' &&
                                  'bg-event-holiday/30 text-success-foreground',
                                event.type === 'info' && 'bg-muted/30 text-muted-foreground'
                              )}
                            >
                              {event.type}
                            </span>
                          )}
                        </div>

                        {/* Event Details */}
                        {(event.location || event.attendees?.length > 0 || event.videoLink) && (
                          <div className="ml-3 space-y-1.5 text-xs text-[#9a9a9a]">
                            {event.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                <span>{event.location}</span>
                              </div>
                            )}
                            {event.attendees && event.attendees.length > 0 && (
                              <div className="flex items-center gap-2">
                                <Users className="h-3 w-3" />
                                <span>{event.attendees.length} attendees</span>
                              </div>
                            )}
                            {event.videoLink && (
                              <div className="flex items-center gap-2">
                                <Video className="h-3 w-3" />
                                <span className="text-info-foreground">Video call</span>
                              </div>
                            )}
                          </div>
                        )}

                        {event.description && (
                          <div className="mt-2 ml-3 line-clamp-2 text-xs text-[#9a9a9a]">
                            {event.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
