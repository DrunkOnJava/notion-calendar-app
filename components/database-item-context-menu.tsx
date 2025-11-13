"use client"

import { useEffect } from "react"
import { Edit2, Trash2, Copy, ExternalLink, Archive } from "lucide-react"

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
    y: Math.min(position.y, window.innerHeight - 350),
  }

  return (
    <div
      className="fixed z-50 bg-surface border border-border rounded-lg shadow-xl py-1 min-w-[200px]"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border truncate">{item.name}</div>

      <div className="py-1">
        <button
          onClick={() => handleAction(() => onOpenInFull(item))}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
        >
          <ExternalLink className="w-4 h-4 text-muted-foreground" />
          <span className="flex-1 text-left">Open in full page</span>
        </button>

        <button
          onClick={() => handleAction(() => onEdit(item))}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
        >
          <Edit2 className="w-4 h-4 text-muted-foreground" />
          <span className="flex-1 text-left">Edit properties</span>
          <span className="text-xs text-muted-foreground">⌘E</span>
        </button>

        <button
          onClick={() => handleAction(() => onDuplicate(item))}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
        >
          <Copy className="w-4 h-4 text-muted-foreground" />
          <span className="flex-1 text-left">Duplicate</span>
          <span className="text-xs text-muted-foreground">⌘D</span>
        </button>

        {onArchive && (
          <button
            onClick={() => handleAction(() => onArchive(item))}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
          >
            <Archive className="w-4 h-4 text-muted-foreground" />
            <span className="flex-1 text-left">Archive</span>
          </button>
        )}
      </div>

      <div className="border-t border-border py-1">
        <button
          onClick={() => handleAction(() => onDelete(item.id))}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/20 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span className="flex-1 text-left">Delete</span>
          <span className="text-xs text-destructive/60">⌫</span>
        </button>
      </div>
    </div>
  )
}
