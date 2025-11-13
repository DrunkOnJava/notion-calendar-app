"use client"

import type React from "react"

import { useState } from "react"
import { X, Plus, Eye, EyeOff, GripVertical, Settings, Trash2, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Calendar {
  id: string
  name: string
  color: string
  visible: boolean
  isDefault?: boolean
  type: "personal" | "google" | "outlook" | "apple" | "shared"
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
  onUpdateCalendar,
  onDeleteCalendar,
  onReorderCalendars,
  onToggleVisibility,
  onSetDefault,
  onCreateGroup,
  onAddToGroup,
}: CalendarListModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [draggedCalendar, setDraggedCalendar] = useState<Calendar | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(groups.map((g) => g.id)))

  if (!isOpen) return null

  const filteredCalendars = calendars.filter((cal) => cal.name.toLowerCase().includes(searchQuery.toLowerCase()))

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

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId)
    } else {
      newExpanded.add(groupId)
    }
    setExpandedGroups(newExpanded)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1c1c1c] rounded-lg w-[600px] max-h-[80vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#2a2a2a]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Manage Calendars</h2>
            <button onClick={onClose} className="hover:bg-[#2a2a2a] p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Search calendars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#2a2a2a] text-sm px-3 py-2 rounded border-none focus:outline-none focus:ring-2 focus:ring-info"
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
                  "flex items-center gap-3 p-3 rounded hover:bg-[#2a2a2a] cursor-move",
                  draggedCalendar?.id === calendar.id && "opacity-50",
                )}
              >
                <GripVertical className="w-4 h-4 text-muted-foreground" />

                <button onClick={() => onToggleVisibility(calendar.id)} className="hover:bg-[#3a3a3a] p-1 rounded">
                  {calendar.visible ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: calendar.color }} />

                <div className="flex-1">
                  <div className="text-sm font-medium">{calendar.name}</div>
                  {calendar.email && <div className="text-xs text-muted-foreground">{calendar.email}</div>}
                </div>

                {calendar.isDefault && (
                  <span className="text-xs bg-info/20 text-info-foreground px-2 py-1 rounded">Default</span>
                )}

                <div className="flex items-center gap-1">
                  {!calendar.isDefault && (
                    <button
                      onClick={() => onSetDefault(calendar.id)}
                      className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 hover:bg-[#3a3a3a] rounded"
                    >
                      Set Default
                    </button>
                  )}

                  <button className="hover:bg-[#3a3a3a] p-1 rounded">
                    <Share2 className="w-4 h-4 text-muted-foreground" />
                  </button>

                  <button className="hover:bg-[#3a3a3a] p-1 rounded">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                  </button>

                  <button onClick={() => onDeleteCalendar(calendar.id)} className="hover:bg-destructive/20 p-1 rounded">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-[#2a2a2a]">
          <button className="w-full flex items-center justify-center gap-2 bg-info hover:bg-info/90 text-info-foreground py-2 px-4 rounded text-sm font-medium">
            <Plus className="w-4 h-4" />
            Add Calendar
          </button>
        </div>
      </div>
    </div>
  )
}
