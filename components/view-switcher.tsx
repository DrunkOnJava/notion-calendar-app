"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Calendar, List } from "lucide-react"
import { cn } from "@/lib/utils"

interface ViewSwitcherProps {
  currentView: "month" | "week" | "day" | "agenda"
  onViewChange: (view: "month" | "week" | "day" | "agenda") => void
}

export function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const views = [
    { id: "month" as const, label: "Month", icon: Calendar },
    { id: "week" as const, label: "Week", icon: Calendar },
    { id: "day" as const, label: "Day", icon: Calendar },
    { id: "agenda" as const, label: "Agenda", icon: List },
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm hover:bg-[#2a2a2a] px-3 py-1.5 rounded"
      >
        <span className="capitalize">{currentView}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg shadow-lg py-1 min-w-[140px] z-50">
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
                  "w-full flex items-center gap-2 px-3 py-2 text-sm text-left",
                  currentView === view.id ? "bg-info text-info-foreground" : "text-[#d0d0d0] hover:bg-[#2a2a2a]",
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{view.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
