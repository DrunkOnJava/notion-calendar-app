# Web Analytics Setup Guide

Complete guide for Vercel Analytics and Speed Insights integration with privacy controls and custom event tracking.

## 📊 What's Tracking

### Automatic Tracking

- **Page Views**: Automatically tracked on route changes
- **Core Web Vitals**: LCP, FID, CLS, FCP, INP, TTFB
- **User Navigation**: Route changes and interactions

### Custom Events Available

- Event management (create, edit, delete, duplicate)
- Calendar interactions (view changes, imports, exports)
- Scheduling and bookings
- Database operations
- Search and UI interactions
- Feature usage

---

## 🔧 Configuration

### Environment Variables

Add to `.env.local`:

```bash
# Analytics Configuration
NEXT_PUBLIC_DEBUG_ANALYTICS=true    # Enable console logging in development
NEXT_PUBLIC_ENABLE_ANALYTICS=false  # Force enable in non-production environments
```

### Automatic Behavior

| Environment | Analytics | Speed Insights | Debug Mode |
| ----------- | --------- | -------------- | ---------- |
| Development | ❌ Off    | ❌ Off         | ✅ On      |
| Production  | ✅ On     | ✅ On          | ❌ Off     |

---

## 🎯 Using Custom Event Tracking

### Basic Event Tracking

```typescript
import { trackEvent } from '@/lib/analytics'

// Track a simple event
trackEvent('event_created', {
  category: 'event',
  eventType: 'meeting',
})
```

### Track Event Creation

```typescript
import { trackEvent } from '@/lib/analytics'

function handleCreateEvent(eventData) {
  // ... create event logic

  trackEvent('event_created', {
    category: 'event',
    eventType: eventData.type,
    isRecurring: !!eventData.recurrence,
    hasReminders: eventData.reminders?.length > 0,
  })
}
```

### Track View Changes

```typescript
import { trackEvent } from '@/lib/analytics'

function handleViewChange(newView: 'month' | 'week' | 'day') {
  // ... change view logic

  trackEvent('view_changed', {
    category: 'calendar',
    label: newView,
  })
}
```

### Track Search Usage

```typescript
import { interaction } from '@/lib/analytics'

function handleSearch(query: string, results: Event[]) {
  interaction.trackSearch(query, results.length)
}
```

### Track Button Clicks

```typescript
import { interaction } from '@/lib/analytics'

<button
  onClick={() => {
    interaction.trackClick('create_event', 'header')
    // ... other logic
  }}
>
  Create Event
</button>
```

### Track Form Submissions

```typescript
import { interaction } from '@/lib/analytics'

async function handleFormSubmit(data) {
  try {
    await saveEvent(data)
    interaction.trackFormSubmit('event_form', true)
  } catch (error) {
    interaction.trackFormSubmit('event_form', false)
  }
}
```

---

## 🔒 Privacy Features

### Automatic Privacy Protection

The analytics system automatically:

1. **Removes sensitive query parameters**:
   - `token`, `secret`, `key`, `password`
   - `email`, `apiKey`, `session`

2. **Filters private routes**:
   - `/admin/*`
   - `/api/internal/*`

3. **Respects user opt-out**:
   - Checks `localStorage.getItem('va-disable')`

### User Opt-Out

Allow users to opt out of analytics:

```typescript
// Opt out
localStorage.setItem('va-disable', 'true')

// Opt in
localStorage.removeItem('va-disable')
```

### Custom Filtering

Modify `components/analytics-provider.tsx` to add custom filtering:

```typescript
function beforeSendAnalytics(event: BeforeSendEvent): BeforeSendEvent | null {
  // Add your custom filtering logic
  if (event.url.includes('/your-sensitive-route')) {
    return null // Don't track this event
  }

  return event
}
```

---

## 📈 Performance Tracking

### Track Custom Timing

```typescript
import { performance } from '@/lib/analytics'

const start = Date.now()
await heavyOperation()
const duration = Date.now() - start

performance.trackTiming('heavy_operation', duration)
```

### Track Component Render Time

```typescript
import { performance } from '@/lib/analytics'
import { useEffect, useRef } from 'react'

export function MyComponent() {
  const renderStart = useRef(Date.now())

  useEffect(() => {
    const renderTime = Date.now() - renderStart.current
    performance.trackRender('MyComponent', renderTime)
  }, [])

  return <div>...</div>
}
```

---

## 🚀 Production Deployment

### Pre-Deployment Checklist

- [ ] Verify `.env.local` does NOT include `NEXT_PUBLIC_DEBUG_ANALYTICS=true`
- [ ] Analytics enabled in Vercel dashboard
- [ ] Speed Insights enabled in Vercel dashboard
- [ ] Test events in development with debug mode
- [ ] Review privacy filtering rules

### Testing in Development

```bash
# Enable debug mode
NEXT_PUBLIC_DEBUG_ANALYTICS=true pnpm dev

# Check browser console for analytics events
# You should see: [Analytics] event_name { data }
```

### Verifying in Production

1. **Deploy to Vercel**

   ```bash
   git push origin main
   ```

2. **Check Vercel Dashboard**
   - Navigate to: https://vercel.com/your-team/notion-calendar-app
   - Click "Analytics" tab
   - Click "Speed Insights" tab

3. **Test Live Events**
   - Visit your production URL
   - Perform tracked actions (create event, change view, etc.)
   - Wait 5-10 minutes for data to appear in dashboard

---

## 📊 Viewing Analytics Data

### Analytics Dashboard

**Location**: Vercel Dashboard → Your Project → Analytics

**Available Metrics**:

- Page views over time
- Top pages by traffic
- Custom events (all `trackEvent()` calls)
- User paths and flows
- Geographic distribution
- Device breakdown

### Speed Insights Dashboard

**Location**: Vercel Dashboard → Your Project → Speed Insights

**Available Metrics**:

- Real Experience Score (RES)
- Core Web Vitals:
  - LCP (Largest Contentful Paint)
  - FID (First Input Delay)
  - CLS (Cumulative Layout Shift)
  - FCP (First Contentful Paint)
  - INP (Interaction to Next Paint)
  - TTFB (Time to First Byte)
- Performance by page
- Device-specific metrics

---

## 🛠️ Troubleshooting

### Analytics Not Showing

1. **Check environment**:

   ```bash
   echo $NODE_ENV  # Should be 'production'
   ```

2. **Verify Vercel dashboard settings**:
   - Analytics: Enabled
   - Speed Insights: Enabled

3. **Check browser console**:
   - No errors related to `@vercel/analytics`
   - Debug mode shows events (in dev)

### Events Not Tracking

1. **Enable debug mode** in development:

   ```bash
   NEXT_PUBLIC_DEBUG_ANALYTICS=true pnpm dev
   ```

2. **Check console for**:

   ```
   [Analytics] event_name { category: 'calendar', ... }
   ```

3. **Verify production deployment**:
   - Wait 5-10 minutes for data propagation
   - Check Vercel Analytics dashboard

### Privacy Filtering Too Aggressive

1. **Review `beforeSendAnalytics`** in `components/analytics-provider.tsx`
2. **Adjust sensitive parameters list**
3. **Modify private routes filter**

---

## 📖 Best Practices

### DO ✅

- Track meaningful user actions (feature usage, conversions)
- Use semantic event names (`event_created`, not `click1`)
- Include relevant metadata (category, type, success)
- Respect user privacy (remove sensitive data)
- Test with debug mode enabled
- Review analytics regularly for insights

### DON'T ❌

- Track personally identifiable information (PII)
- Track every single click/interaction
- Send sensitive data in event names
- Skip privacy filtering
- Forget to test before deploying
- Track development environment events

---

## 🔗 Additional Resources

- [Vercel Analytics Docs](https://vercel.com/docs/analytics)
- [Vercel Speed Insights Docs](https://vercel.com/docs/speed-insights)
- [Core Web Vitals Guide](https://web.dev/vitals/)
- [Custom Events API](https://vercel.com/docs/analytics/custom-events)

---

## 🎉 Quick Start

1. **Install dependencies** (already done):

   ```bash
   pnpm add @vercel/analytics @vercel/speed-insights
   ```

2. **Import and use**:

   ```typescript
   import { trackEvent } from '@/lib/analytics'

   trackEvent('event_created', {
     category: 'event',
     eventType: 'meeting',
   })
   ```

3. **Deploy and verify**:
   ```bash
   git push origin main
   # Wait 5-10 minutes
   # Check Vercel Dashboard → Analytics
   ```

Done! Your analytics are now live and tracking. 🚀
