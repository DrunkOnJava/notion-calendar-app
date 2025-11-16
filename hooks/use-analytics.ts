/**
 * React hook for easy analytics integration
 *
 * Provides convenient methods for tracking events in components
 */

import { useCallback } from 'react'
import {
  trackEvent,
  trackPageView,
  trackFeatureUsage,
  trackConversion,
  interaction,
  performance as analyticsPerformance,
  type AnalyticsEvent,
  type AnalyticsEventData,
} from '@/lib/analytics'

export function useAnalytics() {
  /**
   * Track a custom event
   */
  const track = useCallback((eventName: AnalyticsEvent, data?: AnalyticsEventData) => {
    trackEvent(eventName, data)
  }, [])

  /**
   * Track page navigation
   */
  const trackNavigation = useCallback((path: string) => {
    trackPageView(path)
  }, [])

  /**
   * Track feature usage
   */
  const trackFeature = useCallback(
    (feature: string, metadata?: Record<string, string | number | boolean>) => {
      trackFeatureUsage(feature, metadata)
    },
    []
  )

  /**
   * Track conversion events
   */
  const trackUserConversion = useCallback(
    (type: 'signup' | 'booking' | 'subscription', value?: number) => {
      trackConversion(type, value)
    },
    []
  )

  /**
   * Track button clicks
   */
  const trackClick = useCallback((buttonName: string, location?: string) => {
    interaction.trackClick(buttonName, location)
  }, [])

  /**
   * Track search queries
   */
  const trackSearch = useCallback((query: string, resultsCount: number) => {
    interaction.trackSearch(query, resultsCount)
  }, [])

  /**
   * Track form submissions
   */
  const trackForm = useCallback((formName: string, success: boolean) => {
    interaction.trackFormSubmit(formName, success)
  }, [])

  /**
   * Track performance metrics
   */
  const trackPerformance = useCallback((metric: string, duration: number) => {
    analyticsPerformance.trackTiming(metric, duration)
  }, [])

  /**
   * Track component render time
   */
  const trackRender = useCallback((componentName: string, duration: number) => {
    analyticsPerformance.trackRender(componentName, duration)
  }, [])

  return {
    // Core tracking
    track,
    trackNavigation,
    trackFeature,
    trackUserConversion,

    // Interaction tracking
    trackClick,
    trackSearch,
    trackForm,

    // Performance tracking
    trackPerformance,
    trackRender,
  }
}

/**
 * Usage Examples:
 *
 * @example Basic event tracking
 * ```tsx
 * function EventCreateButton() {
 *   const { track } = useAnalytics()
 *
 *   const handleCreate = () => {
 *     // ... create logic
 *     track('event_created', {
 *       category: 'event',
 *       eventType: 'meeting',
 *     })
 *   }
 *
 *   return <button onClick={handleCreate}>Create Event</button>
 * }
 * ```
 *
 * @example Track search
 * ```tsx
 * function SearchBar() {
 *   const { trackSearch } = useAnalytics()
 *
 *   const handleSearch = (query: string, results: Event[]) => {
 *     trackSearch(query, results.length)
 *   }
 *
 *   return <input onChange={e => handleSearch(e.target.value, filteredResults)} />
 * }
 * ```
 *
 * @example Track performance
 * ```tsx
 * function HeavyComponent() {
 *   const { trackPerformance } = useAnalytics()
 *
 *   useEffect(() => {
 *     const start = Date.now()
 *     heavyOperation()
 *     trackPerformance('heavy_operation', Date.now() - start)
 *   }, [trackPerformance])
 * }
 * ```
 */
