'use client'

import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Calendar, ChevronDown, List } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface ViewSwitcherProps {
  currentView: 'month' | 'week' | 'day' | 'agenda'
  currentDate: Date
  onViewChange: (view: 'month' | 'week' | 'day' | 'agenda') => void
}

export function ViewSwitcher({ currentView, currentDate, onViewChange }: ViewSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const views = [
    { id: 'month' as const, label: 'Month', icon: Calendar },
    { id: 'week' as const, label: 'Week', icon: Calendar },
    { id: 'day' as const, label: 'Day', icon: Calendar },
    { id: 'agenda' as const, label: 'Agenda', icon: List },
  ]

  const activeView = views.find((view) => view.id === currentView)
  const buttonLabel =
    currentView === 'month' ? format(currentDate, 'MMMM yyyy') : (activeView?.label ?? currentView)

  return (
    <div className="relative" ref={dropdownRef} data-testid="view-switcher">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded px-3 py-1.5 text-sm transition-all duration-200 hover:bg-[#2a2a2a] hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        data-testid="view-switcher-button"
        aria-label={`Current view: ${buttonLabel}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <span className="capitalize">{buttonLabel}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-300 ease-out',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 z-50 mt-1 min-w-[140px] rounded-lg border border-[#2a2a2a] bg-[#1c1c1c] py-1 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200"
          role="menu"
          aria-label="View options"
        >
          {views.map((view) => {
            const Icon = view.icon
            return (
              <button
                key={view.id}
                onClick={() => {
                  onViewChange(view.id)
                  setIsOpen(false)
                }}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-all duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info focus-visible:ring-inset',
                  currentView === view.id
                    ? 'bg-info text-info-foreground shadow-sm'
                    : 'text-[#d0d0d0] hover:bg-[#2a2a2a] hover:translate-x-1'
                )}
                data-testid={`view-${view.id}`}
                aria-pressed={currentView === view.id}
                role="menuitemradio"
                aria-checked={currentView === view.id}
              >
                <Icon className="h-4 w-4" />
                <span>{view.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
