import { useRef, useState, useCallback, useEffect } from 'react'
import { hapticFeedback } from '@/lib/touch-utils'

interface DragDropOptions<T> {
  onDragStart?: (item: T, index: number) => void
  onDragOver?: (fromIndex: number, toIndex: number) => void
  onDrop?: (item: T, fromIndex: number, toIndex: number) => void
  onDragEnd?: () => void
}

/**
 * Drag and drop hook for reordering items
 * Works with both mouse and touch events
 */
export function useDragAndDrop<T>(
  items: T[],
  options: DragDropOptions<T> = {}
) {
  const { onDragStart, onDragOver, onDrop, onDragEnd } = options

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null)
  const draggedItemRef = useRef<T | null>(null)

  const handleDragStart = useCallback(
    (index: number) => {
      setDraggedIndex(index)
      draggedItemRef.current = items[index]
      hapticFeedback('light')
      onDragStart?.(items[index], index)
    },
    [items, onDragStart]
  )

  const handleDragOver = useCallback(
    (index: number) => {
      if (draggedIndex === null || draggedIndex === index) return

      setDraggedOverIndex(index)
      onDragOver?.(draggedIndex, index)
    },
    [draggedIndex, onDragOver]
  )

  const handleDrop = useCallback(
    (index: number) => {
      if (draggedIndex === null || draggedItemRef.current === null) return

      hapticFeedback('medium')
      onDrop?.(draggedItemRef.current, draggedIndex, index)

      setDraggedIndex(null)
      setDraggedOverIndex(null)
      draggedItemRef.current = null
      onDragEnd?.()
    },
    [draggedIndex, onDrop, onDragEnd]
  )

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null)
    setDraggedOverIndex(null)
    draggedItemRef.current = null
    onDragEnd?.()
  }, [onDragEnd])

  const getDragHandleProps = (index: number) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => {
      e.dataTransfer.effectAllowed = 'move'
      handleDragStart(index)
    },
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      handleDragOver(index)
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault()
      handleDrop(index)
    },
    onDragEnd: handleDragEnd,
  })

  const getItemProps = (index: number) => ({
    'data-dragging': draggedIndex === index,
    'data-drag-over': draggedOverIndex === index,
  })

  return {
    draggedIndex,
    draggedOverIndex,
    getDragHandleProps,
    getItemProps,
    isDragging: draggedIndex !== null,
  }
}

/**
 * Drag-to-calendar hook
 * For dragging events onto calendar time slots
 */
export function useDragToCalendar<T>() {
  const [draggedItem, setDraggedItem] = useState<T | null>(null)
  const [dropTarget, setDropTarget] = useState<{
    date: Date
    time?: string
  } | null>(null)

  const startDrag = useCallback((item: T) => {
    setDraggedItem(item)
    hapticFeedback('light')
  }, [])

  const handleDragOver = useCallback((date: Date, time?: string) => {
    setDropTarget({ date, time })
  }, [])

  const handleDrop = useCallback(
    (onDrop: (item: T, target: { date: Date; time?: string }) => void) => {
      if (draggedItem && dropTarget) {
        hapticFeedback('medium')
        onDrop(draggedItem, dropTarget)
        setDraggedItem(null)
        setDropTarget(null)
      }
    },
    [draggedItem, dropTarget]
  )

  const cancelDrag = useCallback(() => {
    setDraggedItem(null)
    setDropTarget(null)
  }, [])

  return {
    draggedItem,
    dropTarget,
    startDrag,
    handleDragOver,
    handleDrop,
    cancelDrag,
    isDragging: draggedItem !== null,
  }
}

/**
 * Sortable list hook with animations
 */
export function useSortable<T extends { id: string }>(
  items: T[],
  onReorder: (items: T[]) => void
) {
  const [localItems, setLocalItems] = useState(items)

  const { draggedIndex, draggedOverIndex, getDragHandleProps, getItemProps } =
    useDragAndDrop(localItems, {
      onDrop: (item, fromIndex, toIndex) => {
        const newItems = [...localItems]
        newItems.splice(fromIndex, 1)
        newItems.splice(toIndex, 0, item)

        setLocalItems(newItems)
        onReorder(newItems)
      },
    })

  // Sync with external changes
  useEffect(() => {
    setLocalItems(items)
  }, [items])

  return {
    items: localItems,
    draggedIndex,
    draggedOverIndex,
    getDragHandleProps,
    getItemProps,
  }
}

/**
 * Get CSS classes for drag state
 */
export function getDragStateClasses(
  isDragging: boolean,
  isDraggedOver: boolean
) {
  return {
    dragging: isDragging ? 'opacity-50 cursor-grabbing scale-105' : '',
    draggedOver: isDraggedOver ? 'border-info border-2 bg-info/10' : '',
    default: !isDragging && !isDraggedOver ? 'cursor-grab' : '',
  }
}
