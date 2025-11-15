/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization disabled for static export compatibility
  images: {
    unoptimized: true,
  },
  // Enable system TLS certificates for Turbopack (fixes Google Fonts fetch issues)
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
}

export default nextConfig
