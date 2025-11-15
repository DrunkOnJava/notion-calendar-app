import { useEffect, useRef } from 'react'

/**
 * Custom hook to trap focus within a modal/dialog element
 * Improves accessibility by keeping keyboard navigation within the modal
 */
export function useFocusTrap(isActive: boolean = true) {
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isActive || !elementRef.current) return

    const element = elementRef.current
    const focusableElements = element.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstFocusable = focusableElements[0]
    const lastFocusable = focusableElements[focusableElements.length - 1]

    // Focus first element when modal opens
    firstFocusable?.focus()

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault()
          lastFocusable?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault()
          firstFocusable?.focus()
        }
      }
    }

    element.addEventListener('keydown', handleTabKey)

    return () => {
      element.removeEventListener('keydown', handleTabKey)
    }
  }, [isActive])

  return elementRef
}
