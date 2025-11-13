"use client"

import { X, Trash2, Calendar, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MultiSelectToolbarProps {
  selectedCount: number
  onClear: () => void
  onDelete: () => void
  onChangeColor: () => void
  onMoveToCalendar: () => void
}

export function MultiSelectToolbar({
  selectedCount,
  onClear,
  onDelete,
  onChangeColor,
  onMoveToCalendar,
}: MultiSelectToolbarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg shadow-2xl px-4 py-3 flex items-center gap-4 z-50 animate-in slide-in-from-bottom-4">
      <div className="text-sm text-white font-medium">{selectedCount} selected</div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onChangeColor}
          className="text-[#d0d0d0] hover:text-white hover:bg-[#3a3a3a]"
        >
          <Palette className="w-4 h-4 mr-2" />
          Change Color
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onMoveToCalendar}
          className="text-[#d0d0d0] hover:text-white hover:bg-[#3a3a3a]"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Move to Calendar
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-destructive hover:text-destructive/80 hover:bg-destructive/20"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>

      <button
        onClick={onClear}
        className="ml-2 hover:bg-[#3a3a3a] p-1.5 rounded transition-colors"
        title="Clear selection"
      >
        <X className="w-4 h-4 text-[#9a9a9a]" />
      </button>
    </div>
  )
}
