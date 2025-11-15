'use client'

import { useState, useEffect } from 'react'
import { MapPin, Video, Users, Clock, Tag, AlertCircle } from 'lucide-react'
import type { Event } from '@/types/calendar'

interface EventHoverPreviewProps {
  event: Event
  position: { x: number; y: number }
  onClose: () => void
}

export function EventHoverPreview({ event, position, onClose }: EventHoverPreviewProps) {
  const [adjustedPosition, setAdjustedPosition] = useState(position)

  useEffect(() => {
    const preview = document.getElementById('event-hover-preview')
    if (preview) {
      const rect = preview.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let x = position.x
      let y = position.y

      // Adjust if overflowing right
      if (x + rect.width > viewportWidth - 20) {
        x = viewportWidth - rect.width - 20
      }

      // Adjust if overflowing bottom
      if (y + rect.height > viewportHeight - 20) {
        y = position.y - rect.height - 10
      }

      // Adjust if overflowing left
      if (x < 20) {
        x = 20
      }

      // Adjust if overflowing top
      if (y < 20) {
        y = 20
      }

      setAdjustedPosition({ x, y })
    }
  }, [position])

  const formatTime = (time: string) => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const hour = Number.parseInt(hours)
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${period}`
  }

  const getEventDuration = () => {
    if (!event.startTime || !event.endTime) return null

    const start = new Date(`2000-01-01T${event.startTime}`)
    const end = new Date(`2000-01-01T${event.endTime}`)
    const diffMs = end.getTime() - start.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 60) {
      return `${diffMins} min`
    } else {
      const hours = Math.floor(diffMins / 60)
      const mins = diffMins % 60
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div
      id="event-hover-preview"
      className="animate-in fade-in zoom-in-95 fixed z-[100] w-[320px] rounded-lg border border-[#3a3a3a] bg-[#2a2a2a] p-4 shadow-2xl duration-100"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
      }}
      onMouseLeave={onClose}
    >
      <div className="space-y-3">
        {/* Title and Color */}
        <div className="flex items-start gap-3">
          {event.color && (
            <div
              className="h-full w-1 shrink-0 rounded-full"
              style={{ backgroundColor: event.color }}
            />
          )}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-white">{event.title}</h3>
            {event.status && (
              <span
                className={`mt-1 inline-block rounded px-2 py-0.5 text-xs ${
                  event.status === 'confirmed'
                    ? 'bg-success/40 text-success-foreground'
                    : event.status === 'tentative'
                      ? 'bg-warning/40 text-warning-foreground'
                      : 'bg-destructive/40 text-destructive-foreground'
                }`}
              >
                {event.status}
              </span>
            )}
          </div>
        </div>

        {/* Date and Time */}
        <div className="flex items-center gap-2 text-sm text-[#d0d0d0]">
          <Clock className="h-4 w-4 shrink-0 text-[#9a9a9a]" />
          <div>
            <div>{formatDate(event.date)}</div>
            {event.startTime && event.endTime && (
              <div className="text-xs text-[#9a9a9a]">
                {formatTime(event.startTime)} - {formatTime(event.endTime)}
                {getEventDuration() && ` (${getEventDuration()})`}
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        {event.location && (
          <div className="flex items-start gap-2 text-sm text-[#d0d0d0]">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#9a9a9a]" />
            <span className="break-words">{event.location}</span>
          </div>
        )}

        {/* Video Link */}
        {event.videoLink && (
          <div className="flex items-center gap-2 text-sm">
            <Video className="h-4 w-4 shrink-0 text-[#9a9a9a]" />
            <a
              href={event.videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-info hover:text-info/80 truncate"
              onClick={(e) => e.stopPropagation()}
            >
              Join meeting
            </a>
          </div>
        )}

        {/* Attendees */}
        {event.attendees && event.attendees.length > 0 && (
          <div className="flex items-start gap-2 text-sm text-[#d0d0d0]">
            <Users className="mt-0.5 h-4 w-4 shrink-0 text-[#9a9a9a]" />
            <div className="flex-1">
              <div className="mb-1 text-xs text-[#9a9a9a]">
                {event.attendees.length} attendee{event.attendees.length > 1 ? 's' : ''}
              </div>
              <div className="flex flex-wrap gap-1">
                {event.attendees.slice(0, 3).map((attendee: string, idx: number) => (
                  <span key={idx} className="rounded bg-[#3a3a3a] px-2 py-0.5 text-xs">
                    {attendee}
                  </span>
                ))}
                {event.attendees.length > 3 && (
                  <span className="text-xs text-[#9a9a9a]">+{event.attendees.length - 3} more</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex items-start gap-2 text-sm">
            <Tag className="mt-0.5 h-4 w-4 shrink-0 text-[#9a9a9a]" />
            <div className="flex flex-wrap gap-1">
              {event.tags.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="bg-badge-blue/40 text-badge-blue-foreground rounded px-2 py-0.5 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description Preview */}
        {event.description && (
          <div className="line-clamp-2 border-t border-[#3a3a3a] pt-2 text-xs text-[#9a9a9a]">
            {event.description}
          </div>
        )}

        {/* Priority Indicator */}
        {event.priority && event.priority !== 'medium' && (
          <div className="flex items-center gap-2">
            <AlertCircle
              className={`h-4 w-4 ${event.priority === 'high' ? 'text-destructive' : 'text-info'}`}
            />
            <span
              className={`text-xs ${event.priority === 'high' ? 'text-destructive' : 'text-info'}`}
            >
              {event.priority === 'high' ? 'High Priority' : 'Low Priority'}
            </span>
          </div>
        )}

        {/* Recurrence Info */}
        {event.recurrence && (
          <div className="rounded bg-[#3a3a3a] px-2 py-1 text-xs text-[#9a9a9a]">
            Recurring: {event.recurrence.frequency}
          </div>
        )}

        {/* Click to view full details */}
        <div className="border-t border-[#3a3a3a] pt-1 text-center text-[10px] text-[#6b6b6b]">
          Click to view full details
        </div>
      </div>
    </div>
  )
}
