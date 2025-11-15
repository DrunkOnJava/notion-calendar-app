import { useEffect, useState } from 'react'
import { hapticFeedback } from '@/lib/haptics'

interface VimNavigationOptions {
  onNavigateUp?: () => void
  onNavigateDown?: () => void
  onNavigateLeft?: () => void
  onNavigateRight?: () => void
  onCreateEvent?: () => void
  onDeleteEvent?: () => void
  onEditEvent?: () => void
  onSearch?: () => void
  onGoToToday?: () => void
  onOpenCommand?: () => void
  onToggleView?: () => void
  enabled?: boolean
}

/**
 * Vim-style keyboard navigation for power users
 * Inspired by vim's modal editing and movement keys
 */
export function useVimNavigation(options: VimNavigationOptions) {
  const {
    onNavigateUp,
    onNavigateDown,
    onNavigateLeft,
    onNavigateRight,
    onCreateEvent,
    onDeleteEvent,
    onEditEvent,
    onSearch,
    onGoToToday,
    onOpenCommand,
    onToggleView,
    enabled = true,
  } = options

  const [vimMode, setVimMode] = useState<'normal' | 'insert'>('normal')

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        setVimMode('insert')
        return
      }

      setVimMode('normal')

      // Only handle vim keys in normal mode
      if (vimMode === 'insert') return

      // Vim navigation keys
      switch (e.key.toLowerCase()) {
        // Navigation (hjkl)
        case 'h':
          e.preventDefault()
          hapticFeedback('light')
          onNavigateLeft?.()
          break
        case 'j':
          e.preventDefault()
          hapticFeedback('light')
          onNavigateDown?.()
          break
        case 'k':
          e.preventDefault()
          hapticFeedback('light')
          onNavigateUp?.()
          break
        case 'l':
          e.preventDefault()
          hapticFeedback('light')
          onNavigateRight?.()
          break

        // Actions
        case 'i':
          e.preventDefault()
          onCreateEvent?.()
          break
        case 'a':
          e.preventDefault()
          onCreateEvent?.()
          break
        case 'd':
          if (e.shiftKey) {
            // D = delete
            e.preventDefault()
            onDeleteEvent?.()
          }
          break
        case 'e':
          e.preventDefault()
          onEditEvent?.()
          break

        // Search
        case '/':
          e.preventDefault()
          onSearch?.()
          break

        // Quick actions
        case 't':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault()
            onGoToToday?.()
          }
          break
        case ':':
          e.preventDefault()
          onOpenCommand?.()
          break
        case 'v':
          e.preventDefault()
          onToggleView?.()
          break

        // Escape to normal mode
        case 'escape':
          setVimMode('normal')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, vimMode, ...Object.values(options)])

  return {
    vimMode,
    isEnabled: enabled,
  }
}

/**
 * Advanced keyboard shortcuts beyond vim mode
 */
export const ADVANCED_SHORTCUTS = {
  // Quick navigation
  GO_TO_DATE: { key: 'g', shiftKey: true }, // Shift+G
  JUMP_TO_EVENT: { key: 'j', metaKey: true }, // Cmd/Ctrl+J

  // Bulk operations
  SELECT_ALL: { key: 'a', metaKey: true }, // Cmd/Ctrl+A
  DESELECT_ALL: { key: 'Escape' },

  // View manipulation
  TOGGLE_SIDEBAR: { key: 'b', metaKey: true }, // Cmd/Ctrl+B
  TOGGLE_MINI_CALENDAR: { key: 'm', metaKey: true }, // Cmd/Ctrl+M
  FULL_SCREEN: { key: 'f', metaKey: true }, // Cmd/Ctrl+F

  // Quick filters
  SHOW_ALL: { key: '0', metaKey: true }, // Cmd/Ctrl+0
  FILTER_TODAY: { key: '1', metaKey: true }, // Cmd/Ctrl+1
  FILTER_WEEK: { key: '2', metaKey: true }, // Cmd/Ctrl+2
  FILTER_MONTH: { key: '3', metaKey: true }, // Cmd/Ctrl+3

  // Time travel
  NEXT_DAY: { key: ']' },
  PREV_DAY: { key: '[' },
  NEXT_WEEK: { key: '}', shiftKey: true },
  PREV_WEEK: { key: '{', shiftKey: true },

  // Event operations
  DUPLICATE_EVENT: { key: 'd', metaKey: true }, // Cmd/Ctrl+D
  COPY_EVENT: { key: 'c', metaKey: true }, // Cmd/Ctrl+C
  PASTE_EVENT: { key: 'v', metaKey: true }, // Cmd/Ctrl+V

  // Focus management
  FOCUS_SEARCH: { key: '/' },
  FOCUS_CALENDAR: { key: 'c', altKey: true }, // Alt+C
  FOCUS_SIDEBAR: { key: 's', altKey: true }, // Alt+S
} as const

/**
 * Hook for advanced shortcuts
 */
export function useAdvancedShortcuts(
  shortcuts: Record<string, () => void>,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if typing in input
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      // Check each shortcut
      Object.entries(shortcuts).forEach(([key, callback]) => {
        const shortcut = ADVANCED_SHORTCUTS[key as keyof typeof ADVANCED_SHORTCUTS]
        if (!shortcut) return

        const isMatch =
          e.key === shortcut.key &&
          !!e.shiftKey === !!('shiftKey' in shortcut && shortcut.shiftKey) &&
          !!e.metaKey === !!('metaKey' in shortcut && shortcut.metaKey) &&
          !!e.ctrlKey === !!('ctrlKey' in shortcut && shortcut.ctrlKey) &&
          !!e.altKey === !!('altKey' in shortcut && shortcut.altKey)

        if (isMatch) {
          e.preventDefault()
          callback()
        }
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts, enabled])
}
