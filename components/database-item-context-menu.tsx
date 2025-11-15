'use client'

import { useEffect } from 'react'
import { Edit2, Trash2, Copy, ExternalLink, Archive } from 'lucide-react'

interface DatabaseItemContextMenuProps {
  item: any
  position: { x: number; y: number }
  onClose: () => void
  onEdit: (item: any) => void
  onDelete: (itemId: string) => void
  onDuplicate: (item: any) => void
  onOpenInFull: (item: any) => void
  onArchive?: (item: any) => void
}

export function DatabaseItemContextMenu({
  item,
  position,
  onClose,
  onEdit,
  onDelete,
  onDuplicate,
  onOpenInFull,
  onArchive,
}: DatabaseItemContextMenuProps) {
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
    y: Math.min(position.y, window.innerHeight - 350),
  }

  return (
    <div
      className="bg-surface border-border fixed z-50 min-w-[200px] rounded-lg border py-1 shadow-xl"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-muted-foreground border-border truncate border-b px-3 py-2 text-xs">
        {item.name}
      </div>

      <div className="py-1">
        <button
          onClick={() => handleAction(() => onOpenInFull(item))}
          className="text-foreground hover:bg-accent flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors"
        >
          <ExternalLink className="text-muted-foreground h-4 w-4" />
          <span className="flex-1 text-left">Open in full page</span>
        </button>

        <button
          onClick={() => handleAction(() => onEdit(item))}
          className="text-foreground hover:bg-accent flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors"
        >
          <Edit2 className="text-muted-foreground h-4 w-4" />
          <span className="flex-1 text-left">Edit properties</span>
          <span className="text-muted-foreground text-xs">⌘E</span>
        </button>

        <button
          onClick={() => handleAction(() => onDuplicate(item))}
          className="text-foreground hover:bg-accent flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors"
        >
          <Copy className="text-muted-foreground h-4 w-4" />
          <span className="flex-1 text-left">Duplicate</span>
          <span className="text-muted-foreground text-xs">⌘D</span>
        </button>

        {onArchive && (
          <button
            onClick={() => handleAction(() => onArchive(item))}
            className="text-foreground hover:bg-accent flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors"
          >
            <Archive className="text-muted-foreground h-4 w-4" />
            <span className="flex-1 text-left">Archive</span>
          </button>
        )}
      </div>

      <div className="border-border border-t py-1">
        <button
          onClick={() => handleAction(() => onDelete(item.id))}
          className="text-destructive hover:bg-destructive/20 flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span className="flex-1 text-left">Delete</span>
          <span className="text-destructive/60 text-xs">⌫</span>
        </button>
      </div>
    </div>
  )
}
