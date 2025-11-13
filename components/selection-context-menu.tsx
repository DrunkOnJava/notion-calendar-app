"use client"

import { useEffect } from "react"
import { Trash2, Copy, Palette, Calendar, Archive, Tag } from "lucide-react"

interface SelectionContextMenuProps {
  selectedCount: number
  position: { x: number; y: number }
  onClose: () => void
  onDeleteAll: () => void
  onDuplicateAll: () => void
  onChangeColor: () => void
  onMoveToCalendar: () => void
  onBulkArchive?: () => void
  onAddTag?: () => void
}

export function SelectionContextMenu({
  selectedCount,
  position,
  onClose,
  onDeleteAll,
  onDuplicateAll,
  onChangeColor,
  onMoveToCalendar,
  onBulkArchive,
  onAddTag,
}: SelectionContextMenuProps) {
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
    y: Math.min(position.y, window.innerHeight - 300),
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
      <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border">
        {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
      </div>

      <div className="py-1">
        <button
          onClick={() => handleAction(onDuplicateAll)}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
        >
          <Copy className="w-4 h-4 text-muted-foreground" />
          <span className="flex-1 text-left">Duplicate all</span>
          <span className="text-xs text-muted-foreground">⌘D</span>
        </button>

        <button
          onClick={() => handleAction(onChangeColor)}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
        >
          <Palette className="w-4 h-4 text-muted-foreground" />
          <span className="flex-1 text-left">Change color</span>
        </button>

        <button
          onClick={() => handleAction(onMoveToCalendar)}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
        >
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="flex-1 text-left">Move to calendar</span>
        </button>

        {onAddTag && (
          <button
            onClick={() => handleAction(onAddTag)}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
          >
            <Tag className="w-4 h-4 text-muted-foreground" />
            <span className="flex-1 text-left">Add tag</span>
          </button>
        )}

        {onBulkArchive && (
          <button
            onClick={() => handleAction(onBulkArchive)}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
          >
            <Archive className="w-4 h-4 text-muted-foreground" />
            <span className="flex-1 text-left">Archive all</span>
          </button>
        )}
      </div>

      <div className="border-t border-border py-1">
        <button
          onClick={() => handleAction(onDeleteAll)}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/20 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span className="flex-1 text-left">Delete all</span>
          <span className="text-xs text-destructive/60">⌫</span>
        </button>
      </div>
    </div>
  )
}
