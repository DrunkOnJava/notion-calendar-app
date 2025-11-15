'use client'

import { useState } from 'react'
import { Filter, X, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DatabaseFilterProps {
  properties: string[]
  onFilterChange: (filters: any[]) => void
}

export function DatabaseFilter({ properties, onFilterChange }: DatabaseFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<any[]>([])

  const addFilter = () => {
    const newFilter = {
      id: Date.now().toString(),
      property: properties[0] || '',
      operator: 'is',
      value: '',
    }
    const updated = [...filters, newFilter]
    setFilters(updated)
    onFilterChange(updated)
  }

  const removeFilter = (id: string) => {
    const updated = filters.filter((f) => f.id !== id)
    setFilters(updated)
    onFilterChange(updated)
  }

  const updateFilter = (id: string, field: string, value: any) => {
    const updated = filters.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    setFilters(updated)
    onFilterChange(updated)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-[#2a2a2a]',
          filters.length > 0 && 'text-info'
        )}
      >
        <Filter className="h-4 w-4" />
        {filters.length > 0 && <span className="text-xs">({filters.length})</span>}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 min-w-[400px] rounded-lg border border-[#2a2a2a] bg-[#1c1c1c] p-4 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Filters</h3>
            <button onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4 text-[#6b6b6b]" />
            </button>
          </div>

          <div className="space-y-3">
            {filters.map((filter) => (
              <div key={filter.id} className="flex items-center gap-2">
                <select
                  value={filter.property}
                  onChange={(e) => updateFilter(filter.id, 'property', e.target.value)}
                  className="flex-1 rounded border border-[#3a3a3a] bg-[#2a2a2a] px-2 py-1.5 text-sm outline-none"
                >
                  {properties.map((prop) => (
                    <option key={prop} value={prop}>
                      {prop}
                    </option>
                  ))}
                </select>

                <select
                  value={filter.operator}
                  onChange={(e) => updateFilter(filter.id, 'operator', e.target.value)}
                  className="rounded border border-[#3a3a3a] bg-[#2a2a2a] px-2 py-1.5 text-sm outline-none"
                >
                  <option value="is">is</option>
                  <option value="is-not">is not</option>
                  <option value="contains">contains</option>
                </select>

                <input
                  type="text"
                  value={filter.value}
                  onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                  className="flex-1 rounded border border-[#3a3a3a] bg-[#2a2a2a] px-2 py-1.5 text-sm outline-none"
                  placeholder="Value"
                />

                <button
                  onClick={() => removeFilter(filter.id)}
                  className="rounded p-1 hover:bg-[#3a3a3a]"
                >
                  <X className="h-4 w-4 text-[#6b6b6b]" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addFilter}
            className="mt-3 flex items-center gap-2 text-sm text-[#9a9a9a] hover:text-white"
          >
            <Plus className="h-4 w-4" />
            Add filter
          </button>
        </div>
      )}
    </div>
  )
}
