import { useEffect, useRef, useCallback } from 'react'

interface PrefetchOptions {
  /**
   * Delay before prefetching (ms)
   */
  delay?: number

  /**
   * Only prefetch on hover
   */
  onHoverOnly?: boolean

  /**
   * Cache time (ms)
   */
  cacheTime?: number
}

/**
 * Smart prefetching hook
 * Preloads data before user needs it
 */
export function usePrefetch<T>(
  fetchFn: () => Promise<T>,
  options: PrefetchOptions = {}
) {
  const { delay = 300, onHoverOnly = true, cacheTime = 5 * 60 * 1000 } = options

  const cacheRef = useRef<{
    data: T | null
    timestamp: number
  }>({
    data: null,
    timestamp: 0,
  })

  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const isFetchingRef = useRef(false)

  const prefetch = useCallback(async () => {
    // Check if we have valid cached data
    const now = Date.now()
    const isCacheValid =
      cacheRef.current.data &&
      now - cacheRef.current.timestamp < cacheTime

    if (isCacheValid || isFetchingRef.current) return

    isFetchingRef.current = true

    try {
      const data = await fetchFn()
      cacheRef.current = {
        data,
        timestamp: Date.now(),
      }
    } catch (error) {
      console.error('Prefetch failed:', error)
    } finally {
      isFetchingRef.current = false
    }
  }, [fetchFn, cacheTime])

  const triggerPrefetch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(prefetch, delay)
  }, [prefetch, delay])

  const cancelPrefetch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  const getCachedData = useCallback((): T | null => {
    const now = Date.now()
    const isCacheValid =
      cacheRef.current.data &&
      now - cacheRef.current.timestamp < cacheTime

    return isCacheValid ? cacheRef.current.data : null
  }, [cacheTime])

  const invalidateCache = useCallback(() => {
    cacheRef.current = { data: null, timestamp: 0 }
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    prefetch: triggerPrefetch,
    cancel: cancelPrefetch,
    getCachedData,
    invalidateCache,
  }
}

/**
 * Prefetch link data on hover
 */
export function useLinkPrefetch(href: string) {
  const { prefetch, cancel } = usePrefetch(
    async () => {
      // Prefetch the route
      if (typeof window !== 'undefined' && 'next' in window) {
        // Next.js prefetch
        const router = await import('next/navigation').then(m => m.useRouter)
        // router.prefetch(href)
      }
      return null
    },
    { delay: 200 }
  )

  return {
    onMouseEnter: prefetch,
    onMouseLeave: cancel,
    onFocus: prefetch,
    onBlur: cancel,
  }
}

/**
 * Predictive prefetching based on user behavior
 */
export function usePredictivePrefetch() {
  const navigationPatternRef = useRef<string[]>([])
  const prefetchQueueRef = useRef<Set<string>>(new Set())

  const recordNavigation = useCallback((path: string) => {
    navigationPatternRef.current.push(path)

    // Keep only last 10 navigations
    if (navigationPatternRef.current.length > 10) {
      navigationPatternRef.current.shift()
    }

    // Predict next likely navigation
    const pattern = navigationPatternRef.current
    if (pattern.length >= 3) {
      const lastThree = pattern.slice(-3)

      // If user frequently goes A -> B -> C, prefetch C when at B
      // This is a simple pattern - can be enhanced with ML
      const predictions = predictNextRoutes(lastThree)
      predictions.forEach((route) => prefetchQueueRef.current.add(route))
    }
  }, [])

  const getPredictions = useCallback((): string[] => {
    return Array.from(prefetchQueueRef.current)
  }, [])

  const clearPredictions = useCallback(() => {
    prefetchQueueRef.current.clear()
  }, [])

  return {
    recordNavigation,
    getPredictions,
    clearPredictions,
  }
}

/**
 * Simple route prediction logic
 * Can be enhanced with ML/analytics in the future
 */
function predictNextRoutes(pattern: string[]): string[] {
  // Common patterns
  const commonPatterns: Record<string, string[]> = {
    'month-week-day': ['day'],
    'day-week-month': ['month'],
    'calendar-settings-calendar': ['settings'],
    'calendar-event-calendar': ['event'],
  }

  const patternKey = pattern.join('-')

  return commonPatterns[patternKey] || []
}

/**
 * Prefetch calendar data for adjacent dates
 */
export function useCalendarPrefetch(currentDate: Date) {
  const prefetchedDatesRef = useRef<Set<string>>(new Set())

  const prefetchAdjacentDates = useCallback(
    async (fetchFn: (date: Date) => Promise<any>) => {
      const datesToPrefetch = [
        new Date(currentDate.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
        new Date(currentDate.getTime() - 24 * 60 * 60 * 1000), // Yesterday
        new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000), // Next week
      ]

      for (const date of datesToPrefetch) {
        const dateKey = date.toISOString().split('T')[0]

        if (!prefetchedDatesRef.current.has(dateKey)) {
          try {
            await fetchFn(date)
            prefetchedDatesRef.current.add(dateKey)
          } catch (error) {
            console.error('Failed to prefetch date:', dateKey, error)
          }
        }
      }
    },
    [currentDate]
  )

  return {
    prefetchAdjacentDates,
    clearCache: () => prefetchedDatesRef.current.clear(),
  }
}

/**
 * Idle prefetching - prefetch during idle time
 */
export function useIdlePrefetch(
  tasks: Array<() => Promise<any>>,
  options: { timeout?: number } = {}
) {
  const { timeout = 2000 } = options

  useEffect(() => {
    if (!('requestIdleCallback' in window)) {
      // Fallback for browsers without requestIdleCallback
      const timer = setTimeout(() => {
        tasks.forEach((task) => task().catch(console.error))
      }, timeout)

      return () => clearTimeout(timer)
    }

    const idleCallbacks: number[] = []

    tasks.forEach((task) => {
      const id = window.requestIdleCallback(
        () => {
          task().catch(console.error)
        },
        { timeout }
      )
      idleCallbacks.push(id)
    })

    return () => {
      idleCallbacks.forEach((id) => window.cancelIdleCallback(id))
    }
  }, [tasks, timeout])
}
