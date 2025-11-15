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
        "hover:bg-surface-hover transition-colors border-b border-surface-border/30 last:border-b-0",
        position % 2 === 0 && "bg-surface"
      )}
      style={{
        containerType: 'inline-size',
      }}
    >
      <div
        onClick={() => {
          onToggle()
          onSelect()
        }}
        className="w-full text-left cursor-pointer"
      >
        {/* Single-line row with position and name */}
        <div
          className="grid items-center py-1 pr-2 pl-2 gap-md"
          style={{
            gridTemplateColumns: 'auto 1fr',
            lineHeight: 1.3,
          }}
        >
          {/* Position number */}
          <div className="text-text-tertiary font-mono tabular-nums text-fluid-md">
            {position}
          </div>

          {/* Name column */}
          <div
            className="font-medium text-text-primary truncate flex items-center justify-between text-fluid-base"
            title={person.name}
          >
            <span className="truncate">{person.name}</span>
            <ChevronDown
              className={cn(
                "shrink-0 text-text-tertiary transition-transform icon-md",
                isExpanded && "rotate-180"
              )}
            />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div
          className="pb-2 px-3 pt-1.5 space-y-1.5 bg-surface border-t border-surface-border/50 text-fluid-sm"
        >
          {Object.entries(person.properties).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center whitespace-nowrap gap-sm text-fluid-sm"
            >
              {typeof value === "boolean" ? (
                <>
                  <div
                    className={cn(
                      "rounded border flex items-center justify-center shrink-0 icon-md",
                      value ? "bg-info border-info" : "border-muted",
                    )}
                  >
                    {value && <span className="font-bold text-fluid-xs">✓</span>}
                  </div>
                  <span className="text-text-secondary">{key}</span>
                </>
              ) : key === "Certification Level" ? (
                <>
                  <span className="text-text-secondary">{key}</span>
                  <span
                    className="ml-auto bg-success/50 text-success-foreground rounded font-medium whitespace-nowrap badge-responsive"
                  >
                    {value}
                  </span>
                </>
              ) : key === "Shift" ? (
                <>
                  <span className="text-text-secondary">{key}</span>
                  <span
                    className="ml-auto bg-badge-pink text-badge-pink-foreground rounded font-medium whitespace-nowrap badge-responsive"
                  >
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
