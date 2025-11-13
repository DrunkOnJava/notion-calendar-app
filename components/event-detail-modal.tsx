"use client"

import { useState } from "react"
import {
  X,
  Edit2,
  Trash2,
  Copy,
  Calendar,
  Clock,
  MapPin,
  Users,
  Bell,
  Video,
  FileText,
  Tag,
  AlertCircle,
  Repeat,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface EventDetailModalProps {
  isOpen: boolean
  onClose: () => void
  event: any
  onEdit: (event: any) => void
  onDelete: (eventId: string) => void
  onDuplicate: (event: any) => void
}

export function EventDetailModal({ isOpen, onClose, event, onEdit, onDelete, onDuplicate }: EventDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)

  if (!isOpen || !event) return null

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this event?")) {
      onDelete(event.id)
      onClose()
    }
  }

  const handleDuplicate = () => {
    onDuplicate(event)
    onClose()
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-destructive"
      case "medium":
        return "text-warning"
      case "low":
        return "text-success"
      default:
        return "text-[#9a9a9a]"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-success/50 text-success-foreground"
      case "tentative":
        return "bg-warning/50 text-warning-foreground"
      case "cancelled":
        return "bg-destructive/50 text-destructive-foreground"
      default:
        return "bg-[#2a2a2a] text-[#9a9a9a]"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1c1c1c] rounded-lg w-[550px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: event.color || "#3B82F6" }}></div>
            <span className="text-sm text-[#9a9a9a]">{event.calendar || "Default Calendar"}</span>
            {event.status && (
              <span className={cn("text-xs px-2 py-0.5 rounded font-medium", getStatusBadge(event.status))}>
                {event.status}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setIsEditing(true)} className="hover:bg-[#2a2a2a] p-1.5 rounded" title="Edit">
              <Edit2 className="w-4 h-4 text-[#6b6b6b]" />
            </button>
            <button onClick={handleDuplicate} className="hover:bg-[#2a2a2a] p-1.5 rounded" title="Duplicate">
              <Copy className="w-4 h-4 text-[#6b6b6b]" />
            </button>
            <button onClick={handleDelete} className="hover:bg-[#2a2a2a] p-1.5 rounded" title="Delete">
              <Trash2 className="w-4 h-4 text-[#6b6b6b]" />
            </button>
            <button onClick={onClose} className="hover:bg-[#2a2a2a] p-1.5 rounded ml-2">
              <X className="w-5 h-5 text-[#6b6b6b]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {/* Title with Priority */}
          <div className="flex items-start gap-2">
            <h2 className="text-2xl font-semibold flex-1">{event.title}</h2>
            {event.priority && event.priority !== "medium" && (
              <span className={cn("text-xs font-medium", getPriorityColor(event.priority))}>
                {event.priority} priority
              </span>
            )}
          </div>

          {/* Recurrence Info */}
          {event.recurrence && (
            <div className="flex items-start gap-3 text-sm bg-info/20 p-3 rounded">
              <Repeat className="w-5 h-5 text-info mt-0.5" />
              <div>
                <div className="text-info-foreground font-medium mb-1">Recurring Event</div>
                <div className="text-info-foreground/80 text-xs">This is part of a recurring series</div>
              </div>
            </div>
          )}

          {/* Date & Time */}
          <div className="flex items-start gap-3 text-sm">
            <Clock className="w-5 h-5 text-[#6b6b6b] mt-0.5" />
            <div>
              <div className="text-[#d0d0d0] font-medium">
                {new Date(event.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              {event.isAllDay ? (
                <div className="text-[#9a9a9a]">All day</div>
              ) : (
                <div className="text-[#9a9a9a]">
                  {event.startTime} - {event.endTime}
                  {event.timezone && <span className="ml-2">({event.timezone.split("/")[1]?.replace("_", " ")})</span>}
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-5 h-5 text-[#6b6b6b] mt-0.5" />
              <div className="text-[#d0d0d0]">{event.location}</div>
            </div>
          )}

          {/* Video Link */}
          {event.videoLink && (
            <div className="flex items-start gap-3 text-sm">
              <Video className="w-5 h-5 text-[#6b6b6b] mt-0.5" />
              <a
                href={event.videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-info hover:text-info/80 underline"
              >
                Join video call
              </a>
            </div>
          )}

          {/* Attendees */}
          {event.attendees && event.attendees.length > 0 && (
            <div className="flex items-start gap-3 text-sm">
              <Users className="w-5 h-5 text-[#6b6b6b] mt-0.5" />
              <div>
                <div className="text-[#d0d0d0] font-medium mb-2">Attendees ({event.attendees.length})</div>
                <div className="space-y-1">
                  {event.attendees.map((attendee: string, idx: number) => (
                    <div key={idx} className="text-[#9a9a9a] flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#2a2a2a] flex items-center justify-center text-xs">
                        {attendee.charAt(0).toUpperCase()}
                      </div>
                      {attendee}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="flex items-start gap-3 text-sm">
              <FileText className="w-5 h-5 text-[#6b6b6b] mt-0.5" />
              <div>
                <div className="text-[#d0d0d0] font-medium mb-1">Description</div>
                <div className="text-[#9a9a9a] whitespace-pre-wrap">{event.description}</div>
              </div>
            </div>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex items-start gap-3 text-sm">
              <Tag className="w-5 h-5 text-[#6b6b6b] mt-0.5" />
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag: string) => (
                  <span key={tag} className="bg-badge-blue text-badge-blue-foreground text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reminders */}
          {event.reminders && event.reminders.length > 0 && (
            <div className="flex items-start gap-3 text-sm border-t border-[#2a2a2a] pt-4">
              <Bell className="w-5 h-5 text-[#6b6b6b] mt-0.5" />
              <div>
                <span className="text-[#d0d0d0]">Reminders: </span>
                <div className="space-y-1">
                  {event.reminders.map((reminder: string, idx: number) => (
                    <div key={idx} className="text-[#9a9a9a]">
                      {reminder
                        .replace("min", " minutes")
                        .replace("hour", " hour")
                        .replace("hours", " hours")
                        .replace("day", " day")
                        .replace("week", " week")}{" "}
                      before
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Visibility */}
          {event.visibility && event.visibility !== "public" && (
            <div className="flex items-start gap-3 text-sm border-t border-[#2a2a2a] pt-4">
              <AlertCircle className="w-5 h-5 text-[#6b6b6b] mt-0.5" />
              <div>
                <span className="text-[#d0d0d0]">Visibility: </span>
                <span className="text-[#9a9a9a] capitalize">{event.visibility}</span>
              </div>
            </div>
          )}

          {/* Calendar */}
          <div className="flex items-start gap-3 text-sm border-t border-[#2a2a2a] pt-4">
            <Calendar className="w-5 h-5 text-[#6b6b6b] mt-0.5" />
            <div className="text-[#d0d0d0]">{event.calendar || "Default Calendar"}</div>
          </div>

          {/* Created At */}
          {event.createdAt && (
            <div className="text-xs text-[#6b6b6b] pt-2 border-t border-[#2a2a2a]">
              Created {new Date(event.createdAt).toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
