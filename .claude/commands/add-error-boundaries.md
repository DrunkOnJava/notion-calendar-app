# Add Error Boundaries

Create proper error boundaries for the application following React 19 best practices.

## 1. Create Global Error Boundary
Create `app/error.tsx`:

```typescript
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h2 className="mb-4 text-2xl font-bold">Something went wrong!</h2>
        <p className="mb-6 text-muted-foreground">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <Button onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  )
}
```

## 2. Create Global Not Found Page
Create `app/not-found.tsx`:

```typescript
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h2 className="mb-4 text-2xl font-bold">404 - Page Not Found</h2>
        <p className="mb-6 text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}
```

## 3. Create Loading Component
Create `app/loading.tsx`:

```typescript
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
```

## Verification
- Test error boundary by throwing an error in a component
- Test 404 page by navigating to non-existent route
- Test loading state (if you have any async route segments)
- Ensure all pages follow the same visual style
- Create commit: `feat: add error boundaries and loading states`
