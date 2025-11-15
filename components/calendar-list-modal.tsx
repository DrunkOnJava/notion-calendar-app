'use client'

import type React from 'react'

import { useState } from 'react'
import { X, Plus, Eye, EyeOff, GripVertical, Settings, Trash2, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Calendar {
  id: string
  name: string
  color: string
  visible: boolean
  isDefault?: boolean
  type: 'personal' | 'google' | 'outlook' | 'apple' | 'shared'
  email?: string
  groupId?: string
}

export interface CalendarGroup {
  id: string
  name: string
  expanded: boolean
}

interface CalendarListModalProps {
  isOpen: boolean
  onClose: () => void
  calendars: Calendar[]
  groups: CalendarGroup[]
  onUpdateCalendar: (calendar: Calendar) => void
  onDeleteCalendar: (id: string) => void
  onReorderCalendars: (calendars: Calendar[]) => void
  onToggleVisibility: (id: string) => void
  onSetDefault: (id: string) => void
  onCreateGroup: (name: string) => void
  onAddToGroup: (calendarId: string, groupId: string) => void
}

export function CalendarListModal({
  isOpen,
  onClose,
  calendars,
  groups,
  onUpdateCalendar: _onUpdateCalendar,
  onDeleteCalendar,
  onReorderCalendars,
  onToggleVisibility,
  onSetDefault,
  onCreateGroup: _onCreateGroup,
  onAddToGroup: _onAddToGroup,
}: CalendarListModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [draggedCalendar, setDraggedCalendar] = useState<Calendar | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(groups.map((g) => g.id))
  )

  if (!isOpen) return null

  const filteredCalendars = calendars.filter((cal) =>
    cal.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDragStart = (calendar: Calendar) => {
    setDraggedCalendar(calendar)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetCalendar: Calendar) => {
    if (!draggedCalendar) return

    const newCalendars = [...calendars]
    const draggedIndex = newCalendars.findIndex((c) => c.id === draggedCalendar.id)
    const targetIndex = newCalendars.findIndex((c) => c.id === targetCalendar.id)

    newCalendars.splice(draggedIndex, 1)
    newCalendars.splice(targetIndex, 0, draggedCalendar)

    onReorderCalendars(newCalendars)
    setDraggedCalendar(null)
  }

  const _toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId)
    } else {
      newExpanded.add(groupId)
    }
    setExpandedGroups(newExpanded)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex max-h-[80vh] w-[600px] flex-col overflow-hidden rounded-lg bg-[#1c1c1c]">
        <div className="border-b border-[#2a2a2a] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Manage Calendars</h2>
            <button onClick={onClose} className="rounded p-1 hover:bg-[#2a2a2a]">
              <X className="h-5 w-5" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Search calendars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="focus:ring-info w-full rounded border-none bg-[#2a2a2a] px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-2">
            {filteredCalendars.map((calendar) => (
              <div
                key={calendar.id}
                draggable
                onDragStart={() => handleDragStart(calendar)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(calendar)}
                className={cn(
                  'flex cursor-move items-center gap-3 rounded p-3 hover:bg-[#2a2a2a]',
                  draggedCalendar?.id === calendar.id && 'opacity-50'
                )}
              >
                <GripVertical className="text-muted-foreground h-4 w-4" />

                <button
                  onClick={() => onToggleVisibility(calendar.id)}
                  className="rounded p-1 hover:bg-[#3a3a3a]"
                >
                  {calendar.visible ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="text-muted-foreground h-4 w-4" />
                  )}
                </button>

                <div
                  className="h-4 w-4 shrink-0 rounded-full"
                  style={{ backgroundColor: calendar.color }}
                />

                <div className="flex-1">
                  <div className="text-sm font-medium">{calendar.name}</div>
                  {calendar.email && (
                    <div className="text-muted-foreground text-xs">{calendar.email}</div>
                  )}
                </div>

                {calendar.isDefault && (
                  <span className="bg-info/20 text-info-foreground rounded px-2 py-1 text-xs">
                    Default
                  </span>
                )}

                <div className="flex items-center gap-1">
                  {!calendar.isDefault && (
                    <button
                      onClick={() => onSetDefault(calendar.id)}
                      className="text-muted-foreground hover:text-foreground rounded px-2 py-1 text-xs hover:bg-[#3a3a3a]"
                    >
                      Set Default
                    </button>
                  )}

                  <button className="rounded p-1 hover:bg-[#3a3a3a]">
                    <Share2 className="text-muted-foreground h-4 w-4" />
                  </button>

                  <button className="rounded p-1 hover:bg-[#3a3a3a]">
                    <Settings className="text-muted-foreground h-4 w-4" />
                  </button>

                  <button
                    onClick={() => onDeleteCalendar(calendar.id)}
                    className="hover:bg-destructive/20 rounded p-1"
                  >
                    <Trash2 className="text-destructive h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#2a2a2a] p-4">
          <button className="bg-info hover:bg-info/90 text-info-foreground flex w-full items-center justify-center gap-2 rounded px-4 py-2 text-sm font-medium">
            <Plus className="h-4 w-4" />
            Add Calendar
          </button>
        </div>
      </div>
    </div>
  )
}
