/**
 * Skip Link component for accessibility
 * Allows keyboard users to skip to main content
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="focus:bg-info focus:text-info-foreground focus:ring-info-foreground sr-only transition-all duration-200 focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:px-4 focus:py-2 focus:shadow-lg focus:ring-2 focus:ring-offset-2 focus:outline-none"
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
