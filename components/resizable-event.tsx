'use client'

import type React from 'react'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ResizableEventProps {
  event: any
  onResize: (event: any, newStartTime: string, newEndTime: string) => void
  onClick: (event: any) => void
  onContextMenu?: (e: React.MouseEvent, event: any) => void
  children: React.ReactNode
  className?: string
  timeSlotHeight?: number
}

export function ResizableEvent({
  event,
  onResize,
  onClick,
  onContextMenu,
  children,
  className,
  timeSlotHeight = 60,
}: ResizableEventProps) {
  const [isResizing, setIsResizing] = useState<'top' | 'bottom' | null>(null)
  const [startY, setStartY] = useState(0)
  const [originalHeight, setOriginalHeight] = useState(0)
  const [originalTop, setOriginalTop] = useState(0)
  const eventRef = useRef<HTMLDivElement>(null)

  const handleResizeStart = (e: React.MouseEvent, edge: 'top' | 'bottom') => {
    e.stopPropagation()
    e.preventDefault()

    setIsResizing(edge)
    setStartY(e.clientY)

    if (eventRef.current) {
      const rect = eventRef.current.getBoundingClientRect()
      setOriginalHeight(rect.height)
      setOriginalTop(rect.top)
    }
  }

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!eventRef.current) return

      const deltaY = e.clientY - startY
      const deltaMinutes = Math.round((deltaY / timeSlotHeight) * 60)

      if (isResizing === 'bottom') {
        // Resize from bottom - change end time
        const currentEndTime = event.endTime || event.startTime
        const [hours, minutes] = currentEndTime.split(':').map(Number)
        const totalMinutes = hours * 60 + minutes + deltaMinutes

        // Clamp to reasonable bounds (minimum 15 minutes)
        const startMinutes = event.startTime
          ? Number.parseInt(event.startTime.split(':')[0]) * 60 +
            Number.parseInt(event.startTime.split(':')[1])
          : 0
        const clampedMinutes = Math.max(startMinutes + 15, Math.min(1440, totalMinutes))

        const newHours = Math.floor(clampedMinutes / 60)
        const newMinutes = clampedMinutes % 60
        const newEndTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`

        // Update visual feedback
        const newHeight = Math.max(30, originalHeight + deltaY)
        eventRef.current.style.height = `${newHeight}px`
      } else if (isResizing === 'top') {
        // Resize from top - change start time
        const [hours, minutes] = event.startTime.split(':').map(Number)
        const totalMinutes = hours * 60 + minutes + deltaMinutes

        // Clamp to reasonable bounds
        const endMinutes = event.endTime
          ? Number.parseInt(event.endTime.split(':')[0]) * 60 +
            Number.parseInt(event.endTime.split(':')[1])
          : totalMinutes + 60
        const clampedMinutes = Math.max(0, Math.min(endMinutes - 15, totalMinutes))

        const newHours = Math.floor(clampedMinutes / 60)
        const newMinutes = clampedMinutes % 60

        // Update visual feedback
        const newHeight = Math.max(30, originalHeight - deltaY)
        eventRef.current.style.height = `${newHeight}px`
        eventRef.current.style.top = `${originalTop + deltaY}px`
      }
    }

    const handleMouseUp = () => {
      if (!eventRef.current) return

      // Calculate final times based on resize
      const deltaY =
        startY - (isResizing === 'top' ? eventRef.current.getBoundingClientRect().top : 0)
      const deltaMinutes = Math.round((deltaY / timeSlotHeight) * 60)

      let newStartTime = event.startTime
      let newEndTime = event.endTime || event.startTime

      if (isResizing === 'bottom') {
        const [hours, minutes] = (event.endTime || event.startTime).split(':').map(Number)
        const totalMinutes =
          hours * 60 +
          minutes +
          Math.round(
            ((eventRef.current.getBoundingClientRect().height - originalHeight) / timeSlotHeight) *
              60
          )
        const startMinutes = event.startTime
          ? Number.parseInt(event.startTime.split(':')[0]) * 60 +
            Number.parseInt(event.startTime.split(':')[1])
          : 0
        const clampedMinutes = Math.max(startMinutes + 15, Math.min(1440, totalMinutes))

        const newHours = Math.floor(clampedMinutes / 60)
        const newMinutes = clampedMinutes % 60
        newEndTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
      } else if (isResizing === 'top') {
        const [hours, minutes] = event.startTime.split(':').map(Number)
        const deltaMinutes = Math.round(
          ((originalTop - eventRef.current.getBoundingClientRect().top) / timeSlotHeight) * 60
        )
        const totalMinutes = hours * 60 + minutes + deltaMinutes

        const endMinutes = event.endTime
          ? Number.parseInt(event.endTime.split(':')[0]) * 60 +
            Number.parseInt(event.endTime.split(':')[1])
          : totalMinutes + 60
        const clampedMinutes = Math.max(0, Math.min(endMinutes - 15, totalMinutes))

        const newHours = Math.floor(clampedMinutes / 60)
        const newMinutes = clampedMinutes % 60
        newStartTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
      }

      // Reset visual state
      eventRef.current.style.height = ''
      eventRef.current.style.top = ''

      // Only trigger resize if times actually changed
      if (newStartTime !== event.startTime || newEndTime !== event.endTime) {
        onResize(event, newStartTime, newEndTime)
      }

      setIsResizing(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, startY, event, timeSlotHeight, originalHeight, originalTop, onResize])

  return (
    <div
      ref={eventRef}
      onClick={(e) => {
        e.stopPropagation()
        onClick(event)
      }}
      onContextMenu={onContextMenu ? (e) => onContextMenu(e, event) : undefined}
      className={cn(
        'group relative cursor-pointer transition-all',
        isResizing && 'z-50',
        className
      )}
    >
      {/* Top resize handle */}
      <div
        onMouseDown={(e) => handleResizeStart(e, 'top')}
        className={cn(
          'absolute top-0 right-0 left-0 h-1 cursor-ns-resize opacity-0 transition-opacity group-hover:opacity-100',
          'hover:bg-white/20 active:bg-white/30'
        )}
        title="Drag to resize"
      />

      {children}

      {/* Bottom resize handle */}
      <div
        onMouseDown={(e) => handleResizeStart(e, 'bottom')}
        className={cn(
          'absolute right-0 bottom-0 left-0 h-1 cursor-ns-resize opacity-0 transition-opacity group-hover:opacity-100',
          'hover:bg-white/20 active:bg-white/30'
        )}
        title="Drag to resize"
      />

      {/* Visual indicator when resizing */}
      {isResizing && (
        <div className="pointer-events-none absolute inset-0 rounded border-2 border-blue-500" />
      )}
    </div>
  )
}
