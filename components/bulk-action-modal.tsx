"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BulkActionModalProps {
  isOpen: boolean
  onClose: () => void
  action: "color" | "calendar"
  selectedCount: number
  onApply: (value: string) => void
}

const COLORS = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#10b981" },
  { name: "Red", value: "#ef4444" },
  { name: "Yellow", value: "#f59e0b" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Pink", value: "#ec4899" },
  { name: "Orange", value: "#f97316" },
  { name: "Teal", value: "#14b8a6" },
]

const CALENDARS = [
  { name: "Personal", icon: "📅" },
  { name: "Work", icon: "💼" },
  { name: "Team", icon: "👥" },
  { name: "Family", icon: "👨‍👩‍👧" },
]

export function BulkActionModal({ isOpen, onClose, action, selectedCount, onApply }: BulkActionModalProps) {
  const [selectedValue, setSelectedValue] = useState<string>("")

  if (!isOpen) return null

  const handleApply = () => {
    if (selectedValue) {
      onApply(selectedValue)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1c1c1c] rounded-lg w-[400px] p-6 border border-[#2a2a2a]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">{action === "color" ? "Change Color" : "Move to Calendar"}</h2>
          <button onClick={onClose} className="hover:bg-[#2a2a2a] p-1 rounded">
            <X className="w-5 h-5 text-[#6b6b6b]" />
          </button>
        </div>

        <p className="text-sm text-[#9a9a9a] mb-6">
          {action === "color"
            ? `Apply color to ${selectedCount} selected event${selectedCount > 1 ? "s" : ""}`
            : `Move ${selectedCount} selected event${selectedCount > 1 ? "s" : ""} to a calendar`}
        </p>

        <div className="mb-6">
          {action === "color" ? (
            <div className="grid grid-cols-4 gap-3">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedValue(color.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedValue === color.value
                      ? "border-white scale-105"
                      : "border-transparent hover:border-[#3a3a3a]"
                  }`}
                  style={{ backgroundColor: `${color.value}40` }}
                >
                  <div className="w-full h-8 rounded" style={{ backgroundColor: color.value }}></div>
                  <div className="text-xs mt-2 text-center text-[#d0d0d0]">{color.name}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {CALENDARS.map((calendar) => (
                <button
                  key={calendar.name}
                  onClick={() => setSelectedValue(calendar.name)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    selectedValue === calendar.name
                      ? "border-info bg-info/10"
                      : "border-[#2a2a2a] hover:border-[#3a3a3a] hover:bg-[#2a2a2a]"
                  }`}
                >
                  <span className="text-xl">{calendar.icon}</span>
                  <span className="text-sm text-[#d0d0d0]">{calendar.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] border-[#3a3a3a] text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={!selectedValue}
            className="flex-1 bg-info hover:bg-info/90 text-info-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  )
}
