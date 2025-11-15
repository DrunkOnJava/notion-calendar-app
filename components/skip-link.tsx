/**
 * Skip Link component for accessibility
 * Allows keyboard users to skip to main content
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-info focus:px-4 focus:py-2 focus:text-info-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-info-foreground focus:ring-offset-2 transition-all duration-200"
    >
      Skip to main content
    </a>
  )
}

/**
 * Main content wrapper that skip link targets
 */
export function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main id="main-content" tabIndex={-1} className="outline-none">
      {children}
    </main>
  )
}
