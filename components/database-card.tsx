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
      className="hover:bg-[#252525] transition-colors border-b border-[#2a2a2a]/30 last:border-b-0"
      style={{ 
        containerType: 'inline-size',
        backgroundColor: position % 2 === 0 ? '#1a1a1a' : 'transparent',
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
          className="grid items-center py-1 pr-2 pl-2"
          style={{
            gridTemplateColumns: 'auto 1fr',
            gap: 'clamp(8px, 1vw, 12px)',
            lineHeight: 1.3,
          }}
        >
          {/* Position number */}
          <div 
            className="text-[#6b6b6b] font-mono tabular-nums"
            style={{
              fontSize: 'clamp(10px, 0.9vw, 14px)',
            }}
          >
            {position}
          </div>
          
          {/* Name column */}
          <div 
            className="font-medium text-[#d0d0d0] whitespace-nowrap flex items-center justify-between"
            style={{
              fontSize: 'clamp(11px, 0.95vw, 15px)',
              overflow: 'visible',
            }}
            title={person.name}
          >
            <span>{person.name}</span>
            <ChevronDown 
              className={cn(
                "shrink-0 text-[#6b6b6b] transition-transform", 
                isExpanded && "rotate-180"
              )} 
              style={{ 
                width: 'clamp(14px, 1.2vw, 16px)',
                height: 'clamp(14px, 1.2vw, 16px)',
              }}
            />

          </div>
        </div>
      </div>

      {isExpanded && (
        <div 
          className="pb-2 px-3 pt-1.5 space-y-1.5 bg-[#1d1d1d]"
          style={{ 
            fontSize: 'clamp(10px, 0.75vw, 12px)',
            borderTop: '1px solid rgba(42, 42, 42, 0.5)',
          }}
        >
          {Object.entries(person.properties).map(([key, value]) => (
            <div 
              key={key} 
              className="flex items-center whitespace-nowrap"
              style={{ 
                gap: 'clamp(4px, 0.8vw, 8px)',
                fontSize: 'clamp(10px, 0.75vw, 12px)',
              }}
            >
              {typeof value === "boolean" ? (
                <>
                  <div
                    className={cn(
                      "rounded border flex items-center justify-center shrink-0",
                      value ? "bg-info border-info" : "border-[#4a4a4a]",
                    )}
                    style={{
                      width: 'clamp(14px, 1.2vw, 16px)',
                      height: 'clamp(14px, 1.2vw, 16px)'
                    }}
                  >
                    {value && <span style={{ fontSize: 'clamp(9px, 0.7vw, 10px)' }} className="font-bold">✓</span>}
                  </div>
                  <span className="text-[#9a9a9a]">{key}</span>
                </>
              ) : key === "Certification Level" ? (
                <>
                  <span className="text-[#9a9a9a]">{key}</span>
                  <span 
                    className="ml-auto bg-success/50 text-success-foreground rounded font-medium whitespace-nowrap"
                    style={{
                      fontSize: 'clamp(9px, 0.7vw, 11px)',
                      padding: 'clamp(2px, 0.3vh, 3px) clamp(6px, 0.8vw, 8px)',
                    }}
                  >
                    {value}
                  </span>
                </>
              ) : key === "Shift" ? (
                <>
                  <span className="text-[#9a9a9a]">{key}</span>
                  <span 
                    className="ml-auto bg-badge-pink text-badge-pink-foreground rounded font-medium whitespace-nowrap"
                    style={{
                      fontSize: 'clamp(9px, 0.7vw, 11px)',
                      padding: 'clamp(2px, 0.3vh, 3px) clamp(6px, 0.8vw, 8px)',
                    }}
                  >
                    {value}
                  </span>
                </>
              ) : (
                <span className="text-[#6b6b6b]" title={`${key}: ${String(value)}`}>
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
