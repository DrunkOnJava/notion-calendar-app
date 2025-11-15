import { useEffect, useRef, useState } from 'react'
import { hapticFeedback } from '@/lib/haptics'

interface GestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onPinchIn?: (scale: number) => void
  onPinchOut?: (scale: number) => void
  onLongPress?: (x: number, y: number) => void
  onDoubleTap?: (x: number, y: number) => void
  swipeThreshold?: number
  longPressDelay?: number
  doubleTapDelay?: number
}

/**
 * Comprehensive gesture detection hook
 * Handles swipe, pinch, long-press, and double-tap gestures
 */
export function useGestures<T extends HTMLElement>(
  options: GestureOptions = {}
) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinchIn,
    onPinchOut,
    onLongPress,
    onDoubleTap,
    swipeThreshold = 50,
    longPressDelay = 500,
    doubleTapDelay = 300,
  } = options

  const elementRef = useRef<T>(null)
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 })
  const lastTapRef = useRef(0)
  const longPressTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const initialDistanceRef = useRef(0)

  // Swipe detection
  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0]
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    }

    // Start long-press timer
    if (onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        hapticFeedback('heavy')
        onLongPress(touch.clientX, touch.clientY)
      }, longPressDelay)
    }

    // Pinch detection
    if (e.touches.length === 2 && (onPinchIn || onPinchOut)) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      initialDistanceRef.current = distance
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    // Cancel long-press if finger moves
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
    }

    // Pinch gesture
    if (e.touches.length === 2 && (onPinchIn || onPinchOut)) {
      const currentDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )

      const scale = currentDistance / initialDistanceRef.current

      if (scale < 0.9 && onPinchIn) {
        onPinchIn(scale)
      } else if (scale > 1.1 && onPinchOut) {
        onPinchOut(scale)
      }
    }
  }

  const handleTouchEnd = (e: TouchEvent) => {
    // Clear long-press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
    }

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y
    const deltaTime = Date.now() - touchStartRef.current.time

    // Double-tap detection
    if (onDoubleTap && deltaTime < 200) {
      const timeSinceLastTap = Date.now() - lastTapRef.current

      if (timeSinceLastTap < doubleTapDelay) {
        hapticFeedback('light')
        onDoubleTap(touch.clientX, touch.clientY)
        lastTapRef.current = 0
        return
      }

      lastTapRef.current = Date.now()
    }

    // Swipe detection
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    // Horizontal swipe
    if (absX > absY && absX > swipeThreshold && deltaTime < 300) {
      hapticFeedback('light')

      if (deltaX > 0) {
        onSwipeRight?.()
      } else {
        onSwipeLeft?.()
      }
    }
    // Vertical swipe
    else if (absY > absX && absY > swipeThreshold && deltaTime < 300) {
      hapticFeedback('light')

      if (deltaY > 0) {
        onSwipeDown?.()
      } else {
        onSwipeUp?.()
      }
    }
  }

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchmove', handleTouchMove, { passive: true })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)

      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
      }
    }
  }, [])

  return elementRef
}

/**
 * Pinch-to-zoom hook
 */
export function usePinchZoom(
  onZoomChange: (scale: number) => void,
  options: {
    minScale?: number
    maxScale?: number
  } = {}
) {
  const { minScale = 0.5, maxScale = 3 } = options
  const [scale, setScale] = useState(1)
  const elementRef = useRef<HTMLElement>(null)
  const initialDistanceRef = useRef(0)
  const initialScaleRef = useRef(1)

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 2) return

    const distance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    )

    initialDistanceRef.current = distance
    initialScaleRef.current = scale
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length !== 2) return

    const currentDistance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    )

    const scaleChange = currentDistance / initialDistanceRef.current
    const newScale = Math.min(
      maxScale,
      Math.max(minScale, initialScaleRef.current * scaleChange)
    )

    setScale(newScale)
    onZoomChange(newScale)
  }

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
    }
  }, [scale])

  return {
    elementRef,
    scale,
    setScale,
    resetZoom: () => setScale(1),
  }
}

/**
 * Long-press hook
 */
export function useLongPress(
  callback: (x: number, y: number) => void,
  delay: number = 500
) {
  const elementRef = useRef<HTMLElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const positionRef = useRef({ x: 0, y: 0 })

  const handleStart = (e: TouchEvent | MouseEvent) => {
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY

    positionRef.current = { x, y }

    timeoutRef.current = setTimeout(() => {
      hapticFeedback('heavy')
      callback(x, y)
    }, delay)
  }

  const handleEnd = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const handleMove = () => {
    // Cancel if finger/mouse moves
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    element.addEventListener('touchstart', handleStart, { passive: true })
    element.addEventListener('touchend', handleEnd, { passive: true })
    element.addEventListener('touchmove', handleMove, { passive: true })
    element.addEventListener('mousedown', handleStart as any)
    element.addEventListener('mouseup', handleEnd)
    element.addEventListener('mousemove', handleMove)

    return () => {
      element.removeEventListener('touchstart', handleStart)
      element.removeEventListener('touchend', handleEnd)
      element.removeEventListener('touchmove', handleMove)
      element.removeEventListener('mousedown', handleStart as any)
      element.removeEventListener('mouseup', handleEnd)
      element.removeEventListener('mousemove', handleMove)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [callback, delay])

  return elementRef
}
