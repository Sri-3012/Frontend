/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // !! WARN !!
    // Only ignoring build errors during development
    // Remove this in production
    ignoreBuildErrors: true,
  },
  eslint: {
    // Only ignoring ESLint errors during development
    // Remove this in production
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [],
    unoptimized: true,
  },
}

export default nextConfig
