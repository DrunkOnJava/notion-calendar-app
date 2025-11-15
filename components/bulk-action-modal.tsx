'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BulkActionModalProps {
  isOpen: boolean
  onClose: () => void
  action: 'color' | 'calendar'
  selectedCount: number
  onApply: (value: string) => void
}

const COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Yellow', value: '#f59e0b' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Teal', value: '#14b8a6' },
]

const CALENDARS = [
  { name: 'Personal', icon: '📅' },
  { name: 'Work', icon: '💼' },
  { name: 'Team', icon: '👥' },
  { name: 'Family', icon: '👨‍👩‍👧' },
]

export function BulkActionModal({
  isOpen,
  onClose,
  action,
  selectedCount,
  onApply,
}: BulkActionModalProps) {
  const [selectedValue, setSelectedValue] = useState<string>('')

  if (!isOpen) return null

  const handleApply = () => {
    if (selectedValue) {
      onApply(selectedValue)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[400px] rounded-lg border border-[#2a2a2a] bg-[#1c1c1c] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {action === 'color' ? 'Change Color' : 'Move to Calendar'}
          </h2>
          <button onClick={onClose} className="rounded p-1 hover:bg-[#2a2a2a]">
            <X className="h-5 w-5 text-[#6b6b6b]" />
          </button>
        </div>

        <p className="mb-6 text-sm text-[#9a9a9a]">
          {action === 'color'
            ? `Apply color to ${selectedCount} selected event${selectedCount > 1 ? 's' : ''}`
            : `Move ${selectedCount} selected event${selectedCount > 1 ? 's' : ''} to a calendar`}
        </p>

        <div className="mb-6">
          {action === 'color' ? (
            <div className="grid grid-cols-4 gap-3">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedValue(color.value)}
                  className={`rounded-lg border-2 p-3 transition-all ${
                    selectedValue === color.value
                      ? 'scale-105 border-white'
                      : 'border-transparent hover:border-[#3a3a3a]'
                  }`}
                  style={{ backgroundColor: `${color.value}40` }}
                >
                  <div
                    className="h-8 w-full rounded"
                    style={{ backgroundColor: color.value }}
                  ></div>
                  <div className="mt-2 text-center text-xs text-[#d0d0d0]">{color.name}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {CALENDARS.map((calendar) => (
                <button
                  key={calendar.name}
                  onClick={() => setSelectedValue(calendar.name)}
                  className={`flex w-full items-center gap-3 rounded-lg border p-3 transition-all ${
                    selectedValue === calendar.name
                      ? 'border-info bg-info/10'
                      : 'border-[#2a2a2a] hover:border-[#3a3a3a] hover:bg-[#2a2a2a]'
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
            className="flex-1 border-[#3a3a3a] bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            disabled={!selectedValue}
            className="bg-info hover:bg-info/90 text-info-foreground flex-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  )
}
