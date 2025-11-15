import { useEffect, useState } from 'react'

/**
 * Hook for managing high contrast mode
 * Applies high contrast theme for better accessibility
 */
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false)

  useEffect(() => {
    // Check if user has high contrast preference
    const hasPreference = window.matchMedia('(prefers-contrast: more)').matches
    if (hasPreference) {
      setIsHighContrast(true)
    }

    // Check localStorage for saved preference
    const saved = localStorage.getItem('high-contrast')
    if (saved !== null) {
      setIsHighContrast(saved === 'true')
    }
  }, [])

  useEffect(() => {
    // Apply or remove high-contrast class
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }

    // Save preference
    localStorage.setItem('high-contrast', isHighContrast.toString())
  }, [isHighContrast])

  const toggle = () => setIsHighContrast((prev) => !prev)
  const enable = () => setIsHighContrast(true)
  const disable = () => setIsHighContrast(false)

  return {
    isHighContrast,
    toggle,
    enable,
    disable,
  }
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  return window.matchMedia('(prefers-contrast: more)').matches
}
