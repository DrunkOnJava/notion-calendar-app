import { useEffect } from 'react'

interface KeyboardShortcutOptions {
  key: string
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
  preventDefault?: boolean
}

/**
 * Custom hook for consistent keyboard shortcut handling
 * Example: useKeyboardShortcut({ key: 'k', metaKey: true }, () => openSearch())
 */
export function useKeyboardShortcut(
  options: KeyboardShortcutOptions,
  callback: () => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const {
        key,
        ctrlKey = false,
        altKey = false,
        shiftKey = false,
        metaKey = false,
        preventDefault = true,
      } = options

      const isMatch =
        event.key.toLowerCase() === key.toLowerCase() &&
        event.ctrlKey === ctrlKey &&
        event.altKey === altKey &&
        event.shiftKey === shiftKey &&
        event.metaKey === metaKey

      if (isMatch) {
        if (preventDefault) {
          event.preventDefault()
        }
        callback()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [options, callback, enabled])
}

/**
 * Preset keyboard shortcuts for common actions
 */
export const SHORTCUTS = {
  COMMAND_PALETTE: {
    key: 'k',
    metaKey: true,
  },
  SEARCH: {
    key: '/',
  },
  NEW_EVENT: {
    key: 'n',
    metaKey: true,
  },
  SETTINGS: {
    key: ',',
    metaKey: true,
  },
  TODAY: {
    key: 't',
    metaKey: true,
  },
  NEXT: {
    key: 'ArrowRight',
  },
  PREVIOUS: {
    key: 'ArrowLeft',
  },
  ESCAPE: {
    key: 'Escape',
  },
} as const
