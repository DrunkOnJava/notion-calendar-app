"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Event } from "@/types/calendar"

interface DraggableEventProps {
  event: Event
  onClick: (event: Event) => void
  onDragStart: (event: Event) => void
  onDragEnd?: (event: Event, newDate: string) => void
  onDuplicate?: (event: Event) => void
  className?: string
  children: React.ReactNode
}

export function DraggableEvent({
  event,
  onClick,
  onDragStart,
  onDragEnd: _onDragEnd,
  onDuplicate: _onDuplicate,
  className,
  children,
}: DraggableEventProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState(false)

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)
    setIsDuplicating(e.altKey)
    e.dataTransfer.effectAllowed = e.altKey ? "copy" : "move"
    e.dataTransfer.setData("application/json", JSON.stringify(event))
    e.dataTransfer.setData("isDuplicate", e.altKey.toString())
    onDragStart(event)
  }

  const handleDragEnd = (_e: React.DragEvent) => {
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
      className={cn("cursor-move", isDragging && "opacity-50", isDuplicating && "cursor-copy", className)}
    >
      {children}
    </div>
  )
}
