'use client'

import { useVirtualScroll } from '@/hooks/use-virtual-scroll'
import { cn } from '@/lib/utils'
import { Calendar, MapPin, Clock } from 'lucide-react'
import type { Event } from '@/types/calendar'

interface VirtualizedAgendaProps {
  events: Event[]
  onEventClick: (event: Event) => void
  containerHeight?: number
  itemHeight?: number
}

/**
 * Virtualized agenda view for efficiently rendering thousands of events
 * Only renders visible items for optimal performance
 */
export function VirtualizedAgenda({
  events,
  onEventClick,
  containerHeight = 600,
  itemHeight = 80,
}: VirtualizedAgendaProps) {
  const {
    containerRef,
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
  } = useVirtualScroll(events, {
    itemHeight,
    containerHeight,
    overscan: 5,
  })

  return (
    <div className="relative">
      {/* Scroll stats for debugging */}
      <div className="mb-2 text-xs text-muted-foreground">
        Rendering {visibleItems.length} of {events.length} events (items {startIndex}-{endIndex})
      </div>

      {/* Virtual scroll container */}
      <div
        ref={containerRef}
        className="overflow-auto rounded-lg border border-[#2a2a2a] bg-[#1c1c1c]"
        style={{ height: containerHeight }}
      >
        {/* Total height spacer */}
        <div style={{ height: totalHeight, position: 'relative' }}>
          {/* Visible items */}
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
              willChange: 'transform',
            }}
          >
            {visibleItems.map((event, index) => (
              <AgendaItem
                key={event.id}
                event={event}
                onClick={() => onEventClick(event)}
                height={itemHeight}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Performance hint */}
      {events.length > 100 && (
        <div className="mt-2 text-xs text-muted-foreground">
          ⚡ Virtual scrolling enabled for optimal performance
        </div>
      )}
    </div>
  )
}

/**
 * Individual agenda item component
 */
function AgendaItem({
  event,
  onClick,
  height,
}: {
  event: Event
  onClick: () => void
  height: number
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full border-b border-[#2a2a2a] px-4 text-left transition-all duration-150',
        'hover:bg-[#2a2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info focus-visible:ring-inset',
        'flex items-start gap-4'
      )}
      style={{ height }}
    >
      {/* Date column */}
      <div className="flex flex-col items-center justify-center gap-1 pt-3" style={{ width: 60 }}>
        <div className="text-xs text-muted-foreground">
          {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short' })}
        </div>
        <div className="text-2xl font-semibold">
          {new Date(event.date).getDate()}
        </div>
        <div className="text-xs text-muted-foreground">
          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
        </div>
      </div>

      {/* Event details */}
      <div className="flex-1 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-medium">{event.title}</h3>

            {event.time && (
              <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{event.time}</span>
              </div>
            )}

            {event.location && (
              <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>

          {/* Event indicator */}
          <div
            className="mt-1 h-2 w-2 rounded-full shrink-0"
            style={{ backgroundColor: event.color || 'var(--info)' }}
          />
        </div>
      </div>
    </button>
  )
}

/**
 * Virtualized list for any items
 */
export function VirtualizedList<T extends { id: string }>({
  items,
  renderItem,
  containerHeight = 600,
  itemHeight = 60,
  emptyMessage = 'No items found',
}: {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  containerHeight?: number
  itemHeight?: number
  emptyMessage?: string
}) {
  const {
    containerRef,
    visibleItems,
    totalHeight,
    offsetY,
  } = useVirtualScroll(items, {
    itemHeight,
    containerHeight,
    overscan: 3,
  })

  if (items.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#1c1c1c] text-muted-foreground"
        style={{ height: containerHeight }}
      >
        {emptyMessage}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="overflow-auto rounded-lg border border-[#2a2a2a] bg-[#1c1c1c]"
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            willChange: 'transform',
          }}
        >
          {visibleItems.map((item) => (
            <div key={item.id} style={{ height: itemHeight }}>
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
