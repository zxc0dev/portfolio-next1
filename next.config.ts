import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'
const repoName = 'portfolio-next1'
const basePath = isProd ? `/${repoName}` : ''

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath,
  assetPrefix: basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
  },
  trailingSlash: true,
}

export default nextConfig
