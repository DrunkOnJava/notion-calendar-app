/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization disabled for static export compatibility
  images: {
    unoptimized: true,
  },
}

export default nextConfig
