"use client"

import { useEffect, useState } from "react"
import { Edit2, Trash2, Copy, Palette, Calendar, Clock, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Event } from "@/types/calendar"

interface EventContextMenuProps {
  event: Event
  position: { x: number; y: number }
  onClose: () => void
  onEdit: (event: Event) => void
  onDelete: (eventId: string) => void
  onDuplicate: (event: Event) => void
  onChangeColor: (event: Event, color: string) => void
  onMoveToCalendar: (event: Event, calendar: string) => void
}

const COLORS = [
  { name: "Red", value: "#ef4444", light: "bg-red-500" },
  { name: "Orange", value: "#f97316", light: "bg-orange-500" },
  { name: "Yellow", value: "#eab308", light: "bg-yellow-500" },
  { name: "Green", value: "#22c55e", light: "bg-green-500" },
  { name: "Blue", value: "#3b82f6", light: "bg-blue-500" },
  { name: "Purple", value: "#a855f7", light: "bg-purple-500" },
  { name: "Pink", value: "#ec4899", light: "bg-pink-500" },
  { name: "Gray", value: "#6b7280", light: "bg-gray-500" },
]

export function EventContextMenu({
  event,
  position,
  onClose,
  onEdit,
  onDelete,
  onDuplicate,
  onChangeColor,
  onMoveToCalendar,
}: EventContextMenuProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showCalendarPicker, setShowCalendarPicker] = useState(false)

  useEffect(() => {
    const handleClickOutside = () => onClose()
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    document.addEventListener("click", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("click", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [onClose])

  const handleAction = (action: () => void) => {
    action()
    onClose()
  }

  // Ensure menu stays within viewport
  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 250),
    y: Math.min(position.y, window.innerHeight - 400),
  }

  return (
    <div
      className="fixed z-50 bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg shadow-xl py-1 min-w-[220px]"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-3 py-2 text-xs text-[#6b6b6b] border-b border-[#2a2a2a]">{event.title}</div>

      <div className="py-1">
        <button
          onClick={() => handleAction(() => onEdit(event))}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#d0d0d0] hover:bg-[#2a2a2a] transition-colors"
        >
          <Edit2 className="w-4 h-4 text-[#6b6b6b]" />
          <span className="flex-1 text-left">Edit event</span>
          <span className="text-xs text-[#6b6b6b]">⌘E</span>
        </button>

        <button
          onClick={() => handleAction(() => onDuplicate(event))}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#d0d0d0] hover:bg-[#2a2a2a] transition-colors"
        >
          <Copy className="w-4 h-4 text-[#6b6b6b]" />
          <span className="flex-1 text-left">Duplicate</span>
          <span className="text-xs text-[#6b6b6b]">⌘D</span>
        </button>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowColorPicker(!showColorPicker)
              setShowCalendarPicker(false)
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#d0d0d0] hover:bg-[#2a2a2a] transition-colors"
          >
            <Palette className="w-4 h-4 text-[#6b6b6b]" />
            <span className="flex-1 text-left">Change color</span>
            <span className="text-[#6b6b6b]">›</span>
          </button>

          {showColorPicker && (
            <div
              className="absolute left-full top-0 ml-1 bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg shadow-xl p-2 min-w-[160px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-4 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleAction(() => onChangeColor(event, color.value))}
                    className={cn("w-8 h-8 rounded hover:scale-110 transition-transform", color.light)}
                    title={color.name}
                  />
                ))}
              </div>
              <button
                onClick={() => handleAction(() => onChangeColor(event, ""))}
                className="w-full mt-2 px-2 py-1.5 text-xs text-[#9a9a9a] hover:text-white hover:bg-[#2a2a2a] rounded transition-colors"
              >
                Reset to default
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowCalendarPicker(!showCalendarPicker)
              setShowColorPicker(false)
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#d0d0d0] hover:bg-[#2a2a2a] transition-colors"
          >
            <Calendar className="w-4 h-4 text-[#6b6b6b]" />
            <span className="flex-1 text-left">Move to calendar</span>
            <span className="text-[#6b6b6b]">›</span>
          </button>

          {showCalendarPicker && (
            <div
              className="absolute left-full top-0 ml-1 bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg shadow-xl py-1 min-w-[180px]"
              onClick={(e) => e.stopPropagation()}
            >
              {["Personal", "Work", "Family", "Holidays"].map((calendar) => (
                <button
                  key={calendar}
                  onClick={() => handleAction(() => onMoveToCalendar(event, calendar))}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#d0d0d0] hover:bg-[#2a2a2a] transition-colors"
                >
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full",
                      calendar === "Personal" && "bg-blue-500",
                      calendar === "Work" && "bg-orange-500",
                      calendar === "Family" && "bg-green-500",
                      calendar === "Holidays" && "bg-purple-500",
                    )}
                  />
                  <span>{calendar}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-[#2a2a2a] py-1">
        <button
          onClick={() => handleAction(() => onDelete(event.id))}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/20 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span className="flex-1 text-left">Delete event</span>
          <span className="text-xs text-destructive/60">⌫</span>
        </button>
      </div>

      {event.startTime && (
        <div className="border-t border-[#2a2a2a] px-3 py-2">
          <div className="flex items-center gap-2 text-xs text-[#6b6b6b]">
            <Clock className="w-3 h-3" />
            <span>
              {event.startTime} - {event.endTime || "No end time"}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2 text-xs text-[#6b6b6b] mt-1">
              <MapPin className="w-3 h-3" />
              <span>{event.location}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
