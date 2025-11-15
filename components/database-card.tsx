"use client"

import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface DatabaseCardProps {
  person: {
    name: string
    time: string
    properties: Record<string, string | number | boolean | null | undefined>
  }
  position: number
  isExpanded: boolean
  onToggle: () => void
  onSelect: () => void
}

export function DatabaseCard({ person, position, isExpanded, onToggle, onSelect }: DatabaseCardProps) {
  return (
    <div
      className={cn(
        "container-responsive hover:bg-surface-hover transition-colors border-b border-surface-border last:border-b-0",
        position % 2 === 0 ? "bg-surface" : "bg-transparent"
      )}
    >
      <div
        onClick={() => {
          onToggle()
          onSelect()
        }}
        className="w-full text-left cursor-pointer"
      >
        {/* Single-line row with position and name */}
        <div className="grid items-center gap-md py-1 px-2 grid-cols-[auto_1fr] optimal-line-height">
          {/* Position number */}
          <div className="text-text-tertiary font-mono tabular-nums text-fluid-sm">
            {position}
          </div>

          {/* Name column */}
          <div
            className="font-medium text-text-secondary whitespace-nowrap flex items-center justify-between text-fluid-base overflow-visible"
            title={person.name}
          >
            <span>{person.name}</span>
            <ChevronDown
              className={cn(
                "icon-sm shrink-0 text-text-tertiary transition-transform",
                isExpanded && "rotate-180"
              )}
            />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="pb-2 px-3 pt-1.5 space-y-1.5 bg-surface-active border-t border-surface-border text-fluid-xs">
          {Object.entries(person.properties).map(([key, value]) => (
            <div key={key} className="flex items-center whitespace-nowrap gap-sm text-fluid-xs">
              {typeof value === "boolean" ? (
                <>
                  <div
                    className={cn(
                      "icon-sm rounded border flex items-center justify-center shrink-0",
                      value ? "bg-info border-info" : "border-input-border"
                    )}
                  >
                    {value && <span className="text-fluid-xs font-bold">✓</span>}
                  </div>
                  <span className="text-text-secondary">{key}</span>
                </>
              ) : key === "Certification Level" ? (
                <>
                  <span className="text-text-secondary">{key}</span>
                  <span className="badge-responsive ml-auto bg-success/50 text-success-foreground">
                    {value}
                  </span>
                </>
              ) : key === "Shift" ? (
                <>
                  <span className="text-text-secondary">{key}</span>
                  <span className="badge-responsive ml-auto bg-badge-pink text-badge-pink-foreground">
                    {value}
                  </span>
                </>
              ) : (
                <span className="text-text-tertiary" title={`${key}: ${String(value)}`}>
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
