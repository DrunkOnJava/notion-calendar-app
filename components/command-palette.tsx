'use client'

import { useState, useEffect } from 'react'
import { Search, Calendar, Plus, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onCommand: (command: string, args?: any) => void
}

const commands = [
  { id: 'create-event', label: 'Create event', icon: Plus, category: 'Actions' },
  { id: 'today', label: 'Go to today', icon: Calendar, category: 'Navigation' },
  { id: 'week-view', label: 'Switch to week view', icon: Calendar, category: 'Views' },
  { id: 'day-view', label: 'Switch to day view', icon: Calendar, category: 'Views' },
  { id: 'month-view', label: 'Switch to month view', icon: Calendar, category: 'Views' },
  { id: 'agenda-view', label: 'Switch to agenda view', icon: Calendar, category: 'Views' },
  { id: 'settings', label: 'Open settings', icon: Settings, category: 'Actions' },
  { id: 'search-events', label: 'Search events', icon: Search, category: 'Actions' },
]

export function CommandPalette({ isOpen, onClose, onCommand }: CommandPaletteProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(search.toLowerCase()) ||
      cmd.category.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    if (isOpen) {
      setSearch('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          onCommand(filteredCommands[selectedIndex].id)
          onClose()
        }
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredCommands, selectedIndex, onCommand, onClose])

  if (!isOpen) return null

  const groupedCommands = filteredCommands.reduce(
    (acc, cmd) => {
      if (!acc[cmd.category]) acc[cmd.category] = []
      acc[cmd.category].push(cmd)
      return acc
    },
    {} as Record<string, typeof commands>
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-[20vh]"
      onClick={onClose}
    >
      <div
        className="w-[600px] overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#1c1c1c] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-[#2a2a2a] px-4 py-3">
          <Search className="h-5 w-5 text-[#6b6b6b]" />
          <input
            type="text"
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#6b6b6b]"
            autoFocus
          />
          <kbd className="rounded bg-[#2a2a2a] px-2 py-1 text-xs text-[#9a9a9a]">ESC</kbd>
        </div>

        {/* Commands List */}
        <div className="max-h-[400px] overflow-auto">
          {Object.entries(groupedCommands).map(([category, cmds]) => (
            <div key={category}>
              <div className="px-4 py-2 text-xs font-medium text-[#6b6b6b]">{category}</div>
              {cmds.map((cmd, idx) => {
                const globalIdx = filteredCommands.findIndex((c) => c.id === cmd.id)
                const Icon = cmd.icon
                return (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      onCommand(cmd.id)
                      onClose()
                    }}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm',
                      globalIdx === selectedIndex
                        ? 'bg-info text-info-foreground'
                        : 'text-[#d0d0d0] hover:bg-[#2a2a2a]'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{cmd.label}</span>
                  </button>
                )
              })}
            </div>
          ))}

          {filteredCommands.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-[#6b6b6b]">No commands found</div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#2a2a2a] px-4 py-2 text-xs text-[#6b6b6b]">
          <div className="flex items-center gap-4">
            <span>
              <kbd className="rounded bg-[#2a2a2a] px-1.5 py-0.5">↑</kbd>
              <kbd className="ml-1 rounded bg-[#2a2a2a] px-1.5 py-0.5">↓</kbd> Navigate
            </span>
            <span>
              <kbd className="rounded bg-[#2a2a2a] px-1.5 py-0.5">Enter</kbd> Select
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
