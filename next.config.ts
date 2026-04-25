import type { NextConfig } from 'next'

// For local development, skip basePath. Set GITHUB_PAGES=true when building for GitHub Pages deployment.
const isGitHubPages = process.env.GITHUB_PAGES === 'true'
const repoName = 'portfolio-next1'
const basePath = isGitHubPages ? `/${repoName}` : ''

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath,
  assetPrefix: basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
  },
  trailingSlash: true,
}

export default nextConfig
