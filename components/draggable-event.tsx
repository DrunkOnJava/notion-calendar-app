'use client'

import type React from 'react'
import type { Event } from '@/types/event'

import { cn } from '@/lib/utils'
import { useState } from 'react'

interface DraggableEventProps {
  event: Event
  onClick: (event: Event) => void
  onDragStart: (event: Event) => void
  onDragEnd: (event: Event, newDate: string) => void
  onDuplicate?: (event: Event) => void
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

export function DraggableEvent({
  event,
  onClick,
  onDragStart,
  onDragEnd,
  onDuplicate,
  className,
  style,
  children,
}: DraggableEventProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState(false)

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)
    setIsDuplicating(e.altKey)
    e.dataTransfer.effectAllowed = e.altKey ? 'copy' : 'move'
    e.dataTransfer.setData('application/json', JSON.stringify(event))
    e.dataTransfer.setData('isDuplicate', e.altKey.toString())
    onDragStart(event)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false)
    setIsDuplicating(false)
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={(e) => {
        e.stopPropagation()
        onClick(event)
      }}
      className={cn(
        'cursor-move',
        isDragging && 'opacity-50',
        isDuplicating && 'cursor-copy',
        className
      )}
      style={style}
      data-testid="calendar-event"
      data-event-id={event.id}
      data-event-title={event.title}
    >
      {children}
    </div>
  )
}
