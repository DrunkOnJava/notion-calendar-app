'use client'

import { X, Trash2, Calendar, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
    <div className="animate-in slide-in-from-bottom-4 fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-lg border border-[#3a3a3a] bg-[#2a2a2a] px-4 py-3 shadow-2xl">
      <div className="text-sm font-medium text-white">{selectedCount} selected</div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onChangeColor}
          className="text-[#d0d0d0] hover:bg-[#3a3a3a] hover:text-white"
        >
          <Palette className="mr-2 h-4 w-4" />
          Change Color
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onMoveToCalendar}
          className="text-[#d0d0d0] hover:bg-[#3a3a3a] hover:text-white"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Move to Calendar
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-destructive hover:text-destructive/80 hover:bg-destructive/20"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      <button
        onClick={onClear}
        className="ml-2 rounded p-1.5 transition-colors hover:bg-[#3a3a3a]"
        title="Clear selection"
      >
        <X className="h-4 w-4 text-[#9a9a9a]" />
      </button>
    </div>
  )
}
