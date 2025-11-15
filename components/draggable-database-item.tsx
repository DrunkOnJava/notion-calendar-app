'use client'

import type React from 'react'

import { useState } from 'react'
import { GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DraggableDatabaseItemProps {
  item: any
  index: number
  onReorder: (fromIndex: number, toIndex: number) => void
  children: React.ReactNode
  className?: string
}

export function DraggableDatabaseItem({
  item,
  index,
  onReorder,
  children,
  className,
}: DraggableDatabaseItemProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('databaseItemIndex', index.toString())
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const fromIndex = Number.parseInt(e.dataTransfer.getData('databaseItemIndex'))
    if (!Number.isNaN(fromIndex) && fromIndex !== index) {
      onReorder(fromIndex, index)
    }
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'group transition-all',
        isDragging && 'opacity-50',
        isDragOver && 'border-info border-t-2',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <div className="cursor-grab opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing">
          <GripVertical className="text-muted-foreground h-4 w-4" />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
