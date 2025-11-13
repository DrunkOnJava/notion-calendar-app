"use client"

import { useState } from "react"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface DatabaseSortProps {
  properties: string[]
  onSortChange: (sort: { property: string; direction: "asc" | "desc" } | null) => void
}

export function DatabaseSort({ properties, onSortChange }: DatabaseSortProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [sort, setSort] = useState<{ property: string; direction: "asc" | "desc" } | null>(null)

  const handleSort = (property: string) => {
    if (sort?.property === property) {
      if (sort.direction === "asc") {
        const newSort = { property, direction: "desc" as const }
        setSort(newSort)
        onSortChange(newSort)
      } else {
        setSort(null)
        onSortChange(null)
      }
    } else {
      const newSort = { property, direction: "asc" as const }
      setSort(newSort)
      onSortChange(newSort)
    }
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn("flex items-center gap-2 text-sm px-2 py-1 rounded hover:bg-[#2a2a2a]", sort && "text-info")}
      >
        <ArrowUpDown className="w-4 h-4" />
        {sort && <span className="text-xs">{sort.property}</span>}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg shadow-lg py-1 min-w-[200px] z-50">
          {properties.map((property) => (
            <button
              key={property}
              onClick={() => handleSort(property)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-[#2a2a2a] text-left"
            >
              <span>{property}</span>
              {sort?.property === property &&
                (sort.direction === "asc" ? (
                  <ArrowUp className="w-3 h-3 text-info" />
                ) : (
                  <ArrowDown className="w-3 h-3 text-info" />
                ))}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
