import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization disabled for static export compatibility
  images: {
    unoptimized: true,
  },

  // Enhanced logging configuration
  logging: {
    level: 'verbose',
    fullUrl: true,
  },

  // Turbopack configuration
  turbopack: {
    root: process.cwd(),
  },

  // TypeScript error handling
  typescript: {
    // Show detailed TypeScript errors during build
    tsconfigPath: './tsconfig.json',
  },

  // Webpack configuration for production builds with verbose stats
  webpack: (config, { dev, isServer }) => {
    // Enable detailed build stats in development
    if (dev) {
      config.stats = 'verbose'
    }
    return config
  },

  // Enable typed routes for better error messages
  typedRoutes: true,
}

export default withBundleAnalyzer(nextConfig)
