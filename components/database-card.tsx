"use client"

import { ChevronDown, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface DatabaseCardProps {
  person: {
    name: string
    time: string
    properties: Record<string, any>
  }
  isExpanded: boolean
  onToggle: () => void
  onSelect: () => void
}

export function DatabaseCard({ person, isExpanded, onToggle, onSelect }: DatabaseCardProps) {
  return (
    <div className="bg-[#202020] rounded-lg p-3 hover:bg-[#252525] transition-colors cursor-pointer text-left mx-0 my-0 px-3 py-3 font-medium">
      <button
        onClick={() => {
          onToggle()
          onSelect()
        }}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-[#d0d0d0]">{person.name}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
              }}
              className="hover:bg-[#3a3a3a] p-1 rounded"
            >
              <MoreHorizontal className="w-3 h-3 text-[#6b6b6b]" />
            </button>
            <ChevronDown className={cn("w-3 h-3 text-[#6b6b6b] transition-transform", isExpanded && "rotate-180")} />
          </div>
        </div>
        <div className="text-xs text-[#6b6b6b]">{person.time}</div>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-1.5 ml-1">
          {Object.entries(person.properties).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 text-xs">
              {typeof value === "boolean" ? (
                <>
                  <div
                    className={cn(
                      "w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0",
                      value ? "bg-info border-info" : "border-[#4a4a4a]",
                    )}
                  >
                    {value && <span className="text-[10px] font-bold">✓</span>}
                  </div>
                  <span className="text-[#9a9a9a]">{key}</span>
                </>
              ) : key === "Certification Level" ? (
                <>
                  <span className="text-[#9a9a9a]">{key}</span>
                  <span className="ml-auto bg-success/50 text-success-foreground px-2 py-0.5 rounded text-[10px] font-medium">
                    {value}
                  </span>
                </>
              ) : key === "Shift" ? (
                <>
                  <span className="text-[#9a9a9a]">{key}</span>
                  <span className="ml-auto bg-badge-pink text-badge-pink-foreground px-2 py-0.5 rounded text-[10px] font-medium">
                    {value}
                  </span>
                </>
              ) : (
                <span className="text-[#6b6b6b]">
                  {key}: {String(value)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
