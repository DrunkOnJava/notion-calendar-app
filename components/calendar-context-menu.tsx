"use client"

import { useEffect, useState } from "react"
import { Edit2, Trash2, Share2, Eye, EyeOff, Star, Download } from "lucide-react"

interface CalendarContextMenuProps {
  calendar: any
  position: { x: number; y: number }
  onClose: () => void
  onEdit: (calendar: any) => void
  onDelete: (calendarId: string) => void
  onToggleVisibility: (calendarId: string) => void
  onSetDefault: (calendarId: string) => void
  onShare: (calendar: any) => void
  onExport: (calendar: any) => void
  onChangeColor: (calendar: any, color: string) => void
}

const COLORS = [
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Yellow", value: "#eab308" },
  { name: "Green", value: "#22c55e" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#a855f7" },
  { name: "Pink", value: "#ec4899" },
  { name: "Gray", value: "#6b7280" },
]

export function CalendarContextMenu({
  calendar,
  position,
  onClose,
  onEdit,
  onDelete,
  onToggleVisibility,
  onSetDefault,
  onShare,
  onExport,
  onChangeColor,
}: CalendarContextMenuProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)

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

  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 250),
    y: Math.min(position.y, window.innerHeight - 400),
  }

  return (
    <div
      className="fixed z-50 bg-surface border border-border rounded-lg shadow-xl py-1 min-w-[220px]"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border flex items-center gap-2">
        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: calendar.color }}></div>
        <span className="truncate">{calendar.name}</span>
      </div>

      <div className="py-1">
        <button
          onClick={() => handleAction(() => onToggleVisibility(calendar.id))}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
        >
          {calendar.visible ? (
            <>
              <EyeOff className="w-4 h-4 text-muted-foreground" />
              <span className="flex-1 text-left">Hide calendar</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="flex-1 text-left">Show calendar</span>
            </>
          )}
        </button>

        {!calendar.isDefault && (
          <button
            onClick={() => handleAction(() => onSetDefault(calendar.id))}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
          >
            <Star className="w-4 h-4 text-muted-foreground" />
            <span className="flex-1 text-left">Set as default</span>
          </button>
        )}

        <button
          onClick={() => handleAction(() => onEdit(calendar))}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
        >
          <Edit2 className="w-4 h-4 text-muted-foreground" />
          <span className="flex-1 text-left">Edit calendar</span>
        </button>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowColorPicker(!showColorPicker)
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
          >
            <div className="w-4 h-4 rounded border border-border" style={{ backgroundColor: calendar.color }} />
            <span className="flex-1 text-left">Change color</span>
            <span className="text-muted-foreground">›</span>
          </button>

          {showColorPicker && (
            <div
              className="absolute left-full top-0 ml-1 bg-surface border border-border rounded-lg shadow-xl p-2 min-w-[160px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-4 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleAction(() => onChangeColor(calendar, color.value))}
                    className="w-8 h-8 rounded hover:scale-110 transition-transform border border-border"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => handleAction(() => onShare(calendar))}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
        >
          <Share2 className="w-4 h-4 text-muted-foreground" />
          <span className="flex-1 text-left">Share calendar</span>
        </button>

        <button
          onClick={() => handleAction(() => onExport(calendar))}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
        >
          <Download className="w-4 h-4 text-muted-foreground" />
          <span className="flex-1 text-left">Export calendar</span>
        </button>
      </div>

      {!calendar.isDefault && (
        <div className="border-t border-border py-1">
          <button
            onClick={() => handleAction(() => onDelete(calendar.id))}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="flex-1 text-left">Delete calendar</span>
          </button>
        </div>
      )}
    </div>
  )
}
