'use client'

import { useEffect } from 'react'
import { Trash2, Copy, Palette, Calendar, Archive, Tag } from 'lucide-react'

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
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
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
      className="bg-surface border-border fixed z-50 min-w-[220px] rounded-lg border py-1 shadow-xl"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-muted-foreground border-border border-b px-3 py-2 text-xs">
        {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
      </div>

      <div className="py-1">
        <button
          onClick={() => handleAction(onDuplicateAll)}
          className="text-foreground hover:bg-accent flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors"
        >
          <Copy className="text-muted-foreground h-4 w-4" />
          <span className="flex-1 text-left">Duplicate all</span>
          <span className="text-muted-foreground text-xs">⌘D</span>
        </button>

        <button
          onClick={() => handleAction(onChangeColor)}
          className="text-foreground hover:bg-accent flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors"
        >
          <Palette className="text-muted-foreground h-4 w-4" />
          <span className="flex-1 text-left">Change color</span>
        </button>

        <button
          onClick={() => handleAction(onMoveToCalendar)}
          className="text-foreground hover:bg-accent flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors"
        >
          <Calendar className="text-muted-foreground h-4 w-4" />
          <span className="flex-1 text-left">Move to calendar</span>
        </button>

        {onAddTag && (
          <button
            onClick={() => handleAction(onAddTag)}
            className="text-foreground hover:bg-accent flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors"
          >
            <Tag className="text-muted-foreground h-4 w-4" />
            <span className="flex-1 text-left">Add tag</span>
          </button>
        )}

        {onBulkArchive && (
          <button
            onClick={() => handleAction(onBulkArchive)}
            className="text-foreground hover:bg-accent flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors"
          >
            <Archive className="text-muted-foreground h-4 w-4" />
            <span className="flex-1 text-left">Archive all</span>
          </button>
        )}
      </div>

      <div className="border-border border-t py-1">
        <button
          onClick={() => handleAction(onDeleteAll)}
          className="text-destructive hover:bg-destructive/20 flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span className="flex-1 text-left">Delete all</span>
          <span className="text-destructive/60 text-xs">⌫</span>
        </button>
      </div>
    </div>
  )
}
