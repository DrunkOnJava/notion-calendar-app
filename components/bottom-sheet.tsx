'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-media-query'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  snapPoints?: number[] // Percentages of viewport height (e.g., [0.25, 0.5, 0.9])
}

/**
 * Bottom sheet modal component for mobile devices
 * Automatically switches to regular modal on desktop
 */
export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  className,
  snapPoints = [0.9],
}: BottomSheetProps) {
  const isMobile = useIsMobile()
  const sheetRef = useRef<HTMLDivElement>(null)
  const [currentSnapPoint, setCurrentSnapPoint] = useState(snapPoints[snapPoints.length - 1])
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartY(e.touches[0].clientY)
    setCurrentY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    setCurrentY(e.touches[0].clientY)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return

    const dragDistance = currentY - startY
    const threshold = 100 // pixels

    // Close if dragged down more than threshold
    if (dragDistance > threshold) {
      onClose()
    }
    // Otherwise snap back
    else {
      setCurrentY(startY)
    }

    setIsDragging(false)
  }

  const translateY = isDragging ? Math.max(0, currentY - startY) : 0

  if (!isOpen) return null

  // On desktop, use regular modal
  if (!isMobile) {
    return (
      <div
        className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm duration-200"
        onClick={onClose}
      >
        <div
          className={cn(
            'animate-in zoom-in-95 slide-in-from-bottom-4 relative w-full max-w-lg rounded-lg border border-[#2a2a2a] bg-[#1c1c1c] shadow-2xl duration-300',
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="flex items-center justify-between border-b border-[#2a2a2a] px-6 py-4">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="focus-visible:ring-info rounded p-1 transition-colors hover:bg-[#2a2a2a] focus-visible:ring-2 focus-visible:outline-none"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          <div className="max-h-[80vh] overflow-auto">{children}</div>
        </div>
      </div>
    )
  }

  // Mobile bottom sheet
  return (
    <div
      className="animate-in fade-in fixed inset-0 z-50 bg-black/50 backdrop-blur-sm duration-200"
      onClick={onClose}
    >
      <div
        ref={sheetRef}
        className={cn(
          'fixed right-0 bottom-0 left-0 rounded-t-2xl border-t border-[#2a2a2a] bg-[#1c1c1c] shadow-2xl transition-transform duration-300 ease-out',
          'animate-in slide-in-from-bottom duration-300',
          className
        )}
        style={{
          height: `${currentSnapPoint * 100}vh`,
          transform: `translateY(${translateY}px)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div
          className="flex cursor-grab justify-center py-4 active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="h-1 w-12 rounded-full bg-[#4a4a4a]" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-[#2a2a2a] px-6 pb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="focus-visible:ring-info rounded p-1 transition-colors hover:bg-[#2a2a2a] focus-visible:ring-2 focus-visible:outline-none"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div
          className="pb-safe overflow-auto px-6"
          style={{ maxHeight: `calc(${currentSnapPoint * 100}vh - 120px)` }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

/**
 * Bottom sheet hook for easier usage
 */
export function useBottomSheet(initialOpen: boolean = false) {
  const [isOpen, setIsOpen] = useState(initialOpen)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen((prev) => !prev)

  return {
    isOpen,
    open,
    close,
    toggle,
  }
}
