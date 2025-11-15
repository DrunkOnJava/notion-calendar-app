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

  // Turbopack configuration with verbose logging
  turbopack: {
    root: process.cwd(),
    logLevel: 'info',
    logDetail: true,
  },

  // TypeScript error handling
  typescript: {
    // Show detailed TypeScript errors during build
    tsconfigPath: './tsconfig.json',
  },

  // ESLint configuration
  eslint: {
    // Show all linting errors during build
    ignoreDuringBuilds: false,
  },

  // Webpack configuration for production builds
  webpack: (config, { dev, isServer }) => {
    // Enable detailed build stats in development
    if (dev) {
      config.stats = 'verbose'
    }
    return config
  },

  // Enable experimental features for better debugging
  experimental: {
    // Show more detailed error messages
    typedRoutes: true,
  },
}

export default nextConfig
