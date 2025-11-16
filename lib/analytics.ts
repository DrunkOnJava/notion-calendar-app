/**
 * Analytics utility for tracking user events and behavior
 * Wraps @vercel/analytics with custom event tracking
 */

import { track as vercelTrack } from '@vercel/analytics'

/**
 * Custom event types for type safety
 */
export type AnalyticsEvent =
  // Event Management
  | 'event_created'
  | 'event_edited'
  | 'event_deleted'
  | 'event_duplicated'
  | 'recurring_event_created'

  // Calendar Interactions
  | 'view_changed'
  | 'calendar_created'
  | 'calendar_imported'
  | 'calendar_exported'

  // Scheduling
  | 'scheduling_link_created'
  | 'scheduling_link_shared'
  | 'booking_completed'

  // Database
  | 'database_created'
  | 'database_item_added'
  | 'database_filtered'

  // UI Interactions
  | 'search_used'
  | 'command_palette_opened'
  | 'settings_changed'
  | 'theme_changed'

  // Features
  | 'drag_drop_used'
  | 'bulk_action_performed'
  | 'notification_sent'

/**
 * Analytics event data interface
 * Aligned with Vercel's allowed property values
 */
export type AnalyticsEventData = Record<string, string | number | boolean | null>

/**
 * Track a custom event with optional data
 *
 * @example
 * ```ts
 * trackEvent('event_created', {
 *   category: 'event',
 *   eventType: 'meeting',
 *   duration: 60
 * })
 * ```
 */
export function trackEvent(eventName: AnalyticsEvent, data?: AnalyticsEventData): void {
  try {
    // Only track in production or when explicitly enabled
    if (
      process.env.NODE_ENV === 'production' ||
      process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true'
    ) {
      // Filter out undefined values to match Vercel's requirements
      const cleanData = data
        ? Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined))
        : undefined

      vercelTrack(eventName, cleanData)
    } else if (process.env.NEXT_PUBLIC_DEBUG_ANALYTICS === 'true') {
      console.log('[Analytics]', eventName, data)
    }
  } catch (error) {
    console.error('[Analytics Error]', error)
  }
}

/**
 * Track page view
 */
export function trackPageView(path: string): void {
  trackEvent('view_changed', {
    category: 'ui',
    label: path,
  })
}

/**
 * Track feature usage
 */
export function trackFeatureUsage(
  feature: string,
  metadata?: Record<string, string | number | boolean>
): void {
  trackEvent('search_used', {
    category: 'feature',
    label: feature,
    ...metadata,
  })
}

/**
 * Track user conversion events
 */
export function trackConversion(
  conversionType: 'signup' | 'booking' | 'subscription',
  value?: number
): void {
  const data: AnalyticsEventData = {
    category: 'feature',
    label: conversionType,
  }

  if (value !== undefined) {
    data.value = value
  }

  trackEvent('booking_completed', data)
}

/**
 * Track errors for monitoring
 */
export function trackError(errorType: string, errorMessage?: string): void {
  if (process.env.NODE_ENV === 'production') {
    // In production, you might want to send to error tracking service
    console.error('[Tracked Error]', errorType, errorMessage)
  }
}

/**
 * Performance tracking helpers
 */
export const performance = {
  /**
   * Track custom timing metric
   */
  trackTiming(metric: string, duration: number): void {
    trackEvent('settings_changed', {
      category: 'feature',
      label: `performance_${metric}`,
      value: Math.round(duration),
    })
  },

  /**
   * Track component render time
   */
  trackRender(componentName: string, duration: number): void {
    if (duration > 100) {
      // Only track slow renders
      trackEvent('settings_changed', {
        category: 'feature',
        label: `render_${componentName}`,
        value: Math.round(duration),
      })
    }
  },
}

/**
 * User interaction tracking
 */
export const interaction = {
  /**
   * Track button clicks
   */
  trackClick(buttonName: string, location?: string): void {
    const data: AnalyticsEventData = {
      category: 'ui',
      label: buttonName,
    }

    if (location) {
      data.location = location
    }

    trackEvent('command_palette_opened', data)
  },

  /**
   * Track form submissions
   */
  trackFormSubmit(formName: string, success: boolean): void {
    trackEvent('event_created', {
      category: 'ui',
      label: formName,
      success,
    })
  },

  /**
   * Track search queries
   */
  trackSearch(query: string, resultsCount: number): void {
    trackEvent('search_used', {
      category: 'feature',
      value: resultsCount,
    })
  },
}
