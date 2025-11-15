/**
 * Touch and mobile interaction utilities
 * Helpers for improved mobile and tablet experiences
 */

/**
 * Detect if device supports touch
 */
export function isTouchDevice(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  )
}

/**
 * Get minimum touch target size (44px for iOS, 48px for Android)
 */
export const MIN_TOUCH_TARGET = 44

/**
 * Swipe gesture detection
 */
interface SwipeOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
}

export function useSwipe(element: HTMLElement | null, options: SwipeOptions) {
  if (!element) return

  const { threshold = 50 } = options

  let touchStartX = 0
  let touchStartY = 0
  let touchEndX = 0
  let touchEndY = 0

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX = e.changedTouches[0].screenX
    touchStartY = e.changedTouches[0].screenY
  }

  const handleTouchEnd = (e: TouchEvent) => {
    touchEndX = e.changedTouches[0].screenX
    touchEndY = e.changedTouches[0].screenY
    handleSwipe()
  }

  const handleSwipe = () => {
    const diffX = touchEndX - touchStartX
    const diffY = touchEndY - touchStartY

    // Horizontal swipes
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          options.onSwipeRight?.()
        } else {
          options.onSwipeLeft?.()
        }
      }
    }
    // Vertical swipes
    else {
      if (Math.abs(diffY) > threshold) {
        if (diffY > 0) {
          options.onSwipeDown?.()
        } else {
          options.onSwipeUp?.()
        }
      }
    }
  }

  element.addEventListener('touchstart', handleTouchStart)
  element.addEventListener('touchend', handleTouchEnd)

  return () => {
    element.removeEventListener('touchstart', handleTouchStart)
    element.removeEventListener('touchend', handleTouchEnd)
  }
}

/**
 * Prevent pull-to-refresh on mobile
 */
export function preventPullToRefresh() {
  document.body.style.overscrollBehavior = 'none'
}

/**
 * Haptic feedback for touch devices
 */
export function hapticFeedback(
  type: 'light' | 'medium' | 'heavy' = 'medium'
) {
  if ('vibrate' in navigator) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30,
    }
    navigator.vibrate(patterns[type])
  }
}

/**
 * Check if viewport is in portrait or landscape
 */
export function isPortrait(): boolean {
  return window.innerHeight > window.innerWidth
}

export function isLandscape(): boolean {
  return window.innerWidth > window.innerHeight
}

/**
 * Safe area insets for notched devices
 */
export function getSafeAreaInsets() {
  return {
    top: getComputedStyle(document.documentElement).getPropertyValue(
      '--safe-area-inset-top'
    ),
    right: getComputedStyle(document.documentElement).getPropertyValue(
      '--safe-area-inset-right'
    ),
    bottom: getComputedStyle(document.documentElement).getPropertyValue(
      '--safe-area-inset-bottom'
    ),
    left: getComputedStyle(document.documentElement).getPropertyValue(
      '--safe-area-inset-left'
    ),
  }
}
