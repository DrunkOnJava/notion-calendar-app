"use client"

import { useState, useEffect } from "react"
import { MapPin, Video, Users, Clock, Tag, AlertCircle } from "lucide-react"

interface EventHoverPreviewProps {
  event: any
  position: { x: number; y: number }
  onClose: () => void
}

export function EventHoverPreview({ event, position, onClose }: EventHoverPreviewProps) {
  const [adjustedPosition, setAdjustedPosition] = useState(position)

  useEffect(() => {
    const preview = document.getElementById("event-hover-preview")
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
    if (!time) return ""
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const period = hour >= 12 ? "PM" : "AM"
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
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div
      id="event-hover-preview"
      className="fixed z-[100] bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg shadow-2xl p-4 w-[320px] animate-in fade-in zoom-in-95 duration-100"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
      }}
      onMouseLeave={onClose}
    >
      <div className="space-y-3">
        {/* Title and Color */}
        <div className="flex items-start gap-3">
          {event.color && <div className="w-1 h-full rounded-full shrink-0" style={{ backgroundColor: event.color }} />}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white truncate">{event.title}</h3>
            {event.status && (
              <span
                className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${
                  event.status === "confirmed"
                    ? "bg-success/40 text-success-foreground"
                    : event.status === "tentative"
                      ? "bg-warning/40 text-warning-foreground"
                      : "bg-destructive/40 text-destructive-foreground"
                }`}
              >
                {event.status}
              </span>
            )}
          </div>
        </div>

        {/* Date and Time */}
        <div className="flex items-center gap-2 text-sm text-[#d0d0d0]">
          <Clock className="w-4 h-4 text-[#9a9a9a] shrink-0" />
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
            <MapPin className="w-4 h-4 text-[#9a9a9a] shrink-0 mt-0.5" />
            <span className="break-words">{event.location}</span>
          </div>
        )}

        {/* Video Link */}
        {event.videoLink && (
          <div className="flex items-center gap-2 text-sm">
            <Video className="w-4 h-4 text-[#9a9a9a] shrink-0" />
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
            <Users className="w-4 h-4 text-[#9a9a9a] shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-xs text-[#9a9a9a] mb-1">
                {event.attendees.length} attendee{event.attendees.length > 1 ? "s" : ""}
              </div>
              <div className="flex flex-wrap gap-1">
                {event.attendees.slice(0, 3).map((attendee: string, idx: number) => (
                  <span key={idx} className="text-xs bg-[#3a3a3a] px-2 py-0.5 rounded">
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
            <Tag className="w-4 h-4 text-[#9a9a9a] shrink-0 mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {event.tags.map((tag: string, idx: number) => (
                <span key={idx} className="text-xs bg-badge-blue/40 text-badge-blue-foreground px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description Preview */}
        {event.description && (
          <div className="text-xs text-[#9a9a9a] border-t border-[#3a3a3a] pt-2 line-clamp-2">{event.description}</div>
        )}

        {/* Priority Indicator */}
        {event.priority && event.priority !== "medium" && (
          <div className="flex items-center gap-2">
            <AlertCircle className={`w-4 h-4 ${event.priority === "high" ? "text-destructive" : "text-info"}`} />
            <span className={`text-xs ${event.priority === "high" ? "text-destructive" : "text-info"}`}>
              {event.priority === "high" ? "High Priority" : "Low Priority"}
            </span>
          </div>
        )}

        {/* Recurrence Info */}
        {event.recurrence && (
          <div className="text-xs text-[#9a9a9a] bg-[#3a3a3a] px-2 py-1 rounded">
            Recurring: {event.recurrence.frequency}
          </div>
        )}

        {/* Click to view full details */}
        <div className="text-[10px] text-[#6b6b6b] text-center pt-1 border-t border-[#3a3a3a]">
          Click to view full details
        </div>
      </div>
    </div>
  )
}
