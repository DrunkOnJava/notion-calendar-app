'use client'

import { useState } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DatabaseSortProps {
  properties: string[]
  onSortChange: (sort: { property: string; direction: 'asc' | 'desc' } | null) => void
}

export function DatabaseSort({ properties, onSortChange }: DatabaseSortProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [sort, setSort] = useState<{ property: string; direction: 'asc' | 'desc' } | null>(null)

  const handleSort = (property: string) => {
    if (sort?.property === property) {
      if (sort.direction === 'asc') {
        const newSort = { property, direction: 'desc' as const }
        setSort(newSort)
        onSortChange(newSort)
      } else {
        setSort(null)
        onSortChange(null)
      }
    } else {
      const newSort = { property, direction: 'asc' as const }
      setSort(newSort)
      onSortChange(newSort)
    }
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-[#2a2a2a]',
          sort && 'text-info'
        )}
      >
        <ArrowUpDown className="h-4 w-4" />
        {sort && <span className="text-xs">{sort.property}</span>}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 min-w-[200px] rounded-lg border border-[#2a2a2a] bg-[#1c1c1c] py-1 shadow-lg">
          {properties.map((property) => (
            <button
              key={property}
              onClick={() => handleSort(property)}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-[#2a2a2a]"
            >
              <span>{property}</span>
              {sort?.property === property &&
                (sort.direction === 'asc' ? (
                  <ArrowUp className="text-info h-3 w-3" />
                ) : (
                  <ArrowDown className="text-info h-3 w-3" />
                ))}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
