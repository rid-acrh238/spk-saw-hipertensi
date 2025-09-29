const repoBase = process.env.NEXT_PUBLIC_BASE_PATH || 'spk-saw-hipertensi'

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'export',
  basePath: repoBase || undefined,
  assetPrefix: repoBase ? `${repoBase}/` : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
