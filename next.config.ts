import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'
const repoName = 'portfolio-next1'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
  },
  trailingSlash: true,
}

export default nextConfig
