'use client'

import { useState } from 'react'
import type { Event } from '@/types/event'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface EventDetailModalProps {
  isOpen: boolean
  onClose: () => void
  event: Event | null
  onEdit: (event: Event) => void
  onDelete: (eventId: string) => void
  onDuplicate: (event: Event) => void
  eventFiles?: File[]
  onFilesAdded?: (files: File[]) => void
  onRemoveFile?: (fileIndex: number) => void
}

export function EventDetailModal({
  isOpen,
  onClose,
  event,
  onEdit,
  onDelete,
  onDuplicate,
}: EventDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)

  if (!isOpen || !event) return null

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this event?')) {
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
      case 'high':
        return 'text-destructive'
      case 'medium':
        return 'text-warning'
      case 'low':
        return 'text-success'
      default:
        return 'text-[#9a9a9a]'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success/50 text-success-foreground'
      case 'tentative':
        return 'bg-warning/50 text-warning-foreground'
      case 'cancelled':
        return 'bg-destructive/50 text-destructive-foreground'
      default:
        return 'bg-[#2a2a2a] text-[#9a9a9a]'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex max-h-[90vh] w-[550px] flex-col overflow-hidden rounded-lg bg-[#1c1c1c]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2a2a2a] p-4">
          <div className="flex items-center gap-3">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: event.color || '#3B82F6' }}
            ></div>
            <span className="text-sm text-[#9a9a9a]">{event.calendar || 'Default Calendar'}</span>
            {event.status && (
              <span
                className={cn(
                  'rounded px-2 py-0.5 text-xs font-medium',
                  getStatusBadge(event.status)
                )}
              >
                {event.status}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="rounded p-1.5 hover:bg-[#2a2a2a]"
              title="Edit"
            >
              <Edit2 className="h-4 w-4 text-[#6b6b6b]" />
            </button>
            <button
              onClick={handleDuplicate}
              className="rounded p-1.5 hover:bg-[#2a2a2a]"
              title="Duplicate"
            >
              <Copy className="h-4 w-4 text-[#6b6b6b]" />
            </button>
            <button
              onClick={handleDelete}
              className="rounded p-1.5 hover:bg-[#2a2a2a]"
              title="Delete"
            >
              <Trash2 className="h-4 w-4 text-[#6b6b6b]" />
            </button>
            <button onClick={onClose} className="ml-2 rounded p-1.5 hover:bg-[#2a2a2a]">
              <X className="h-5 w-5 text-[#6b6b6b]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4 overflow-auto p-6">
          {/* Title with Priority */}
          <div className="flex items-start gap-2">
            <h2 className="flex-1 text-2xl font-semibold">{event.title}</h2>
            {event.priority && event.priority !== 'medium' && (
              <span className={cn('text-xs font-medium', getPriorityColor(event.priority))}>
                {event.priority} priority
              </span>
            )}
          </div>

          {/* Recurrence Info */}
          {event.recurrence && (
            <div className="bg-info/20 flex items-start gap-3 rounded p-3 text-sm">
              <Repeat className="text-info mt-0.5 h-5 w-5" />
              <div>
                <div className="text-info-foreground mb-1 font-medium">Recurring Event</div>
                <div className="text-info-foreground/80 text-xs">
                  This is part of a recurring series
                </div>
              </div>
            </div>
          )}

          {/* Date & Time */}
          <div className="flex items-start gap-3 text-sm">
            <Clock className="mt-0.5 h-5 w-5 text-[#6b6b6b]" />
            <div>
              <div className="font-medium text-[#d0d0d0]">
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              {event.isAllDay ? (
                <div className="text-[#9a9a9a]">All day</div>
              ) : (
                <div className="text-[#9a9a9a]">
                  {event.startTime} - {event.endTime}
                  {event.timezone && (
                    <span className="ml-2">
                      ({event.timezone.split('/')[1]?.replace('_', ' ')})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="mt-0.5 h-5 w-5 text-[#6b6b6b]" />
              <div className="text-[#d0d0d0]">{event.location}</div>
            </div>
          )}

          {/* Video Link */}
          {event.videoLink && (
            <div className="flex items-start gap-3 text-sm">
              <Video className="mt-0.5 h-5 w-5 text-[#6b6b6b]" />
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
              <Users className="mt-0.5 h-5 w-5 text-[#6b6b6b]" />
              <div>
                <div className="mb-2 font-medium text-[#d0d0d0]">
                  Attendees ({event.attendees.length})
                </div>
                <div className="space-y-1">
                  {event.attendees.map((attendee: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-[#9a9a9a]">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2a2a2a] text-xs">
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
              <FileText className="mt-0.5 h-5 w-5 text-[#6b6b6b]" />
              <div>
                <div className="mb-1 font-medium text-[#d0d0d0]">Description</div>
                <div className="whitespace-pre-wrap text-[#9a9a9a]">{event.description}</div>
              </div>
            </div>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex items-start gap-3 text-sm">
              <Tag className="mt-0.5 h-5 w-5 text-[#6b6b6b]" />
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-badge-blue text-badge-blue-foreground rounded px-2 py-1 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reminders */}
          {event.reminders && event.reminders.length > 0 && (
            <div className="flex items-start gap-3 border-t border-[#2a2a2a] pt-4 text-sm">
              <Bell className="mt-0.5 h-5 w-5 text-[#6b6b6b]" />
              <div>
                <span className="text-[#d0d0d0]">Reminders: </span>
                <div className="space-y-1">
                  {event.reminders.map((reminder: string, idx: number) => (
                    <div key={idx} className="text-[#9a9a9a]">
                      {reminder
                        .replace('min', ' minutes')
                        .replace('hour', ' hour')
                        .replace('hours', ' hours')
                        .replace('day', ' day')
                        .replace('week', ' week')}{' '}
                      before
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Visibility */}
          {event.visibility && event.visibility !== 'public' && (
            <div className="flex items-start gap-3 border-t border-[#2a2a2a] pt-4 text-sm">
              <AlertCircle className="mt-0.5 h-5 w-5 text-[#6b6b6b]" />
              <div>
                <span className="text-[#d0d0d0]">Visibility: </span>
                <span className="text-[#9a9a9a] capitalize">{event.visibility}</span>
              </div>
            </div>
          )}

          {/* Calendar */}
          <div className="flex items-start gap-3 border-t border-[#2a2a2a] pt-4 text-sm">
            <Calendar className="mt-0.5 h-5 w-5 text-[#6b6b6b]" />
            <div className="text-[#d0d0d0]">{event.calendar || 'Default Calendar'}</div>
          </div>

          {/* Created At */}
          {event.createdAt && (
            <div className="border-t border-[#2a2a2a] pt-2 text-xs text-[#6b6b6b]">
              Created {new Date(event.createdAt).toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
