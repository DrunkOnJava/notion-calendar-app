"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Calendar, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  events: any[]
  onEventSelect: (event: any) => void
}

export function SearchBar({ events, onEventSelect }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.location?.toLowerCase().includes(search.toLowerCase()) ||
      event.description?.toLowerCase().includes(search.toLowerCase()),
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % filteredEvents.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + filteredEvents.length) % filteredEvents.length)
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (filteredEvents[selectedIndex]) {
          onEventSelect(filteredEvents[selectedIndex])
          setIsOpen(false)
          setSearch("")
        }
      } else if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, filteredEvents, selectedIndex, onEventSelect])

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b6b]" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search events"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setIsOpen(true)
            setSelectedIndex(0)
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-9 pr-20 py-1.5 bg-transparent text-sm outline-none placeholder:text-[#8a8a8a] w-[280px]"
        />
        {search && (
          <button
            onClick={() => {
              setSearch("")
              setIsOpen(false)
            }}
            className="absolute right-14 top-1/2 -translate-y-1/2 hover:bg-[#3a3a3a] p-1 rounded"
          >
            <X className="w-3 h-3 text-[#6b6b6b]" />
          </button>
        )}
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-[#2a2a2a] px-2 py-0.5 rounded text-[#6b6b6b]">
          ⌘K
        </kbd>
      </div>

      {isOpen && search && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg shadow-lg max-h-[400px] overflow-auto z-50"
        >
          {filteredEvents.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-[#6b6b6b]">No events found</div>
          ) : (
            <div className="py-1">
              {filteredEvents.map((event, idx) => (
                <button
                  key={event.id}
                  onClick={() => {
                    onEventSelect(event)
                    setIsOpen(false)
                    setSearch("")
                  }}
                  className={cn(
                    "w-full flex items-start gap-3 px-4 py-2.5 text-left",
                    idx === selectedIndex ? "bg-info text-info-foreground" : "text-[#d0d0d0] hover:bg-[#2a2a2a]",
                  )}
                >
                  <Calendar className="w-4 h-4 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{event.title}</div>
                    <div className={cn("text-xs mt-0.5", idx === selectedIndex ? "text-white/80" : "text-[#9a9a9a]")}>
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {event.time && ` • ${event.time}`}
                    </div>
                    {event.location && (
                      <div
                        className={cn(
                          "flex items-center gap-1 text-xs mt-1",
                          idx === selectedIndex ? "text-white/70" : "text-[#8a8a8a]",
                        )}
                      >
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
