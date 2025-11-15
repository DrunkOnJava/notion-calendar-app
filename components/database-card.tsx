'use client'

import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

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

export function DatabaseCard({
  person,
  position,
  isExpanded,
  onToggle,
  onSelect,
}: DatabaseCardProps) {
  return (
    <div
      className={cn(
        'hover:bg-surface-hover border-surface-border/30 border-b transition-colors last:border-b-0',
        position % 2 === 0 && 'bg-surface'
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
        className="w-full cursor-pointer text-left"
      >
        {/* Single-line row with position and name */}
        <div
          className="gap-md grid items-center py-1 pr-2 pl-2"
          style={{
            gridTemplateColumns: 'auto 1fr',
            lineHeight: 1.3,
          }}
        >
          {/* Position number */}
          <div className="text-text-tertiary text-fluid-md font-mono tabular-nums">{position}</div>

          {/* Name column */}
          <div
            className="text-text-primary text-fluid-base flex items-center justify-between truncate font-medium"
            title={person.name}
          >
            <span className="truncate">{person.name}</span>
            <ChevronDown
              className={cn(
                'text-text-tertiary icon-md shrink-0 transition-transform',
                isExpanded && 'rotate-180'
              )}
            />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-surface border-surface-border/50 text-fluid-sm space-y-1.5 border-t px-3 pt-1.5 pb-2">
          {Object.entries(person.properties).map(([key, value]) => (
            <div key={key} className="gap-sm text-fluid-sm flex items-center whitespace-nowrap">
              {typeof value === 'boolean' ? (
                <>
                  <div
                    className={cn(
                      'icon-md flex shrink-0 items-center justify-center rounded border',
                      value ? 'bg-info border-info' : 'border-muted'
                    )}
                  >
                    {value && <span className="text-fluid-xs font-bold">✓</span>}
                  </div>
                  <span className="text-text-secondary">{key}</span>
                </>
              ) : key === 'Certification Level' ? (
                <>
                  <span className="text-text-secondary">{key}</span>
                  <span className="bg-success/50 text-success-foreground badge-responsive ml-auto rounded font-medium whitespace-nowrap">
                    {value}
                  </span>
                </>
              ) : key === 'Shift' ? (
                <>
                  <span className="text-text-secondary">{key}</span>
                  <span className="bg-badge-pink text-badge-pink-foreground badge-responsive ml-auto rounded font-medium whitespace-nowrap">
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
