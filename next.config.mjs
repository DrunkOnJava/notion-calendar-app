/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization disabled for static export compatibility
  images: {
    unoptimized: true,
  },
  // Explicitly set the turbopack root to silence warnings
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig
