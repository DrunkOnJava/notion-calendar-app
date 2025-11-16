'use client'

/**
 * Analytics Provider with Privacy Controls
 *
 * Features:
 * - Debug mode in development
 * - Privacy filtering for sensitive data
 * - Custom endpoint support
 * - User opt-out capability
 */

import { Analytics, type BeforeSendEvent } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const isDevelopment = process.env.NODE_ENV === 'development'
const isDebugEnabled = process.env.NEXT_PUBLIC_DEBUG_ANALYTICS === 'true'

/**
 * Filter sensitive data before sending to analytics
 */
function beforeSendAnalytics(event: BeforeSendEvent): BeforeSendEvent | null {
  // Check if user has opted out
  if (typeof window !== 'undefined' && localStorage.getItem('va-disable')) {
    return null
  }

  // Remove sensitive query parameters
  const url = new URL(event.url)

  // List of sensitive parameters to remove
  const sensitiveParams = ['token', 'secret', 'key', 'password', 'email', 'apiKey', 'session']

  sensitiveParams.forEach((param) => {
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param)
    }
  })

  // Filter out private routes
  const privateRoutes = ['/admin', '/api/internal']
  if (privateRoutes.some((route) => url.pathname.startsWith(route))) {
    return null
  }

  return {
    ...event,
    url: url.toString(),
  }
}

/**
 * Filter performance metrics before sending
 */
function beforeSendSpeedInsights(data: any) {
  // Check if user has opted out
  if (typeof window !== 'undefined' && localStorage.getItem('va-disable')) {
    return null
  }

  // Filter out sensitive paths
  if (data.url?.includes('/api/internal') || data.url?.includes('/admin')) {
    return null
  }

  return data
}

export function AnalyticsProvider() {
  return (
    <>
      <Analytics debug={isDevelopment || isDebugEnabled} beforeSend={beforeSendAnalytics} />
      <SpeedInsights debug={isDevelopment || isDebugEnabled} beforeSend={beforeSendSpeedInsights} />
    </>
  )
}
