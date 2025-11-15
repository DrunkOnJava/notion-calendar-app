'use client'

import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface EventSeriesModalProps {
  isOpen: boolean
  onClose: () => void
  onChoice: (choice: 'this' | 'all' | 'future') => void
  title: string
  action: 'edit' | 'delete'
}

export function EventSeriesModal({
  isOpen,
  onClose,
  onChoice,
  title,
  action,
}: EventSeriesModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[400px] rounded-lg bg-[#1c1c1c] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {action === 'edit' ? 'Edit recurring event' : 'Delete recurring event'}
          </h2>
          <button onClick={onClose} className="rounded p-1 hover:bg-[#2a2a2a]">
            <X className="h-4 w-4 text-[#6b6b6b]" />
          </button>
        </div>

        <p className="mb-6 text-sm text-[#9a9a9a]">
          "{title}" is a recurring event. How would you like to {action} it?
        </p>

        <div className="space-y-2">
          <Button
            onClick={() => onChoice('this')}
            variant="outline"
            className="w-full justify-start text-left"
          >
            <div>
              <div className="font-medium">This event</div>
              <div className="text-xs text-[#6b6b6b]">
                {action === 'edit'
                  ? 'Only this instance will be changed'
                  : 'Only this instance will be deleted'}
              </div>
            </div>
          </Button>

          <Button
            onClick={() => onChoice('future')}
            variant="outline"
            className="w-full justify-start text-left"
          >
            <div>
              <div className="font-medium">This and future events</div>
              <div className="text-xs text-[#6b6b6b]">
                {action === 'edit'
                  ? 'This and all future instances will be changed'
                  : 'This and all future instances will be deleted'}
              </div>
            </div>
          </Button>

          <Button
            onClick={() => onChoice('all')}
            variant="outline"
            className="w-full justify-start text-left"
          >
            <div>
              <div className="font-medium">All events</div>
              <div className="text-xs text-[#6b6b6b]">
                {action === 'edit'
                  ? 'All instances will be changed'
                  : 'All instances will be deleted'}
              </div>
            </div>
          </Button>
        </div>

        <Button onClick={onClose} variant="ghost" className="mt-4 w-full">
          Cancel
        </Button>
      </div>
    </div>
  )
}
