/**
 * Loading skeleton components for better perceived performance
 * Use these while content is loading to improve UX
 */

import { cn } from '@/lib/utils'

/**
 * Base skeleton component with shimmer animation
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted/50 relative overflow-hidden',
        'before:absolute before:inset-0',
        'before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent',
        'before:animate-[shimmer_2s_infinite]',
        className
      )}
      {...props}
    />
  )
}

/**
 * Event card skeleton
 */
export function EventCardSkeleton() {
  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#1c1c1c] p-4 space-y-3">
      <div className="flex items-start justify-between">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}

/**
 * Calendar day skeleton
 */
export function CalendarDaySkeleton() {
  return (
    <div className="space-y-2 p-2">
      <Skeleton className="h-4 w-12" />
      <div className="space-y-1">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded" />
        ))}
      </div>
    </div>
  )
}

/**
 * Week view skeleton
 */
export function WeekViewSkeleton() {
  return (
    <div className="grid grid-cols-7 gap-2">
      {[...Array(7)].map((_, i) => (
        <CalendarDaySkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * Agenda item skeleton
 */
export function AgendaItemSkeleton() {
  return (
    <div className="flex items-start gap-4 p-3">
      <div className="flex flex-col items-center gap-1">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}

/**
 * Agenda view skeleton
 */
export function AgendaViewSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-1">
            {[...Array(2)].map((_, j) => (
              <AgendaItemSkeleton key={j} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Search results skeleton
 */
export function SearchResultsSkeleton() {
  return (
    <div className="space-y-1 py-1">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-start gap-3 px-4 py-2.5">
          <Skeleton className="h-4 w-4 mt-0.5 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Modal content skeleton
 */
export function ModalSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-8 w-3/4" />
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <div className="flex gap-3 justify-end">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}

/**
 * Settings section skeleton
 */
export function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-3">
            {[...Array(2)].map((_, j) => (
              <div key={j} className="flex items-center justify-between">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Database card skeleton
 */
export function DatabaseCardSkeleton() {
  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#1c1c1c] p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-5 rounded" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  )
}

/**
 * List skeleton with variable count
 */
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}
