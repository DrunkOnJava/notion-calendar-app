"use client"

import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"

interface DatabaseBoardViewProps {
  items: any[]
  onItemClick: (item: any) => void
  groupByProperty?: string
}

export function DatabaseBoardView({
  items,
  onItemClick,
  groupByProperty = "Certification Level",
}: DatabaseBoardViewProps) {
  const groups = items.reduce(
    (acc, item) => {
      const groupValue = item.properties[groupByProperty] || "No Value"
      if (!acc[groupValue]) acc[groupValue] = []
      acc[groupValue].push(item)
      return acc
    },
    {} as Record<string, any[]>,
  )

  const groupColors: Record<string, string> = {
    EMT: "bg-success/30 border-success",
    Paramedic: "bg-info/30 border-info",
    "No Value": "bg-muted/30 border-muted",
  }

  return (
    <div className="flex gap-4 overflow-x-auto p-4">
      {Object.entries(groups).map(([groupName, groupItems]) => (
        <div key={groupName} className="flex-shrink-0 w-[280px]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#d0d0d0]">
              {groupName} ({groupItems.length})
            </h3>
            <button className="hover:bg-[#2a2a2a] p-1 rounded">
              <Plus className="w-4 h-4 text-[#6b6b6b]" />
            </button>
          </div>

          <div className="space-y-2">
            {groupItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => onItemClick(item)}
                className={cn(
                  "bg-[#1c1c1c] border rounded-lg p-3 cursor-pointer hover:bg-[#252525] transition-colors",
                  groupColors[groupName] || "border-[#2a2a2a]",
                )}
              >
                <div className="font-medium text-sm text-[#d0d0d0] mb-2">{item.name}</div>
                <div className="text-xs text-[#9a9a9a]">{item.time}</div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {Object.entries(item.properties)
                    .filter(([key, value]) => typeof value === "boolean" && value)
                    .slice(0, 4)
                    .map(([key]) => (
                      <span key={key} className="bg-[#2a2a2a] text-[#d0d0d0] px-2 py-0.5 rounded text-xs">
                        {key}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
