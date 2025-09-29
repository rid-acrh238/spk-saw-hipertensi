const repoBase = process.env.NEXT_PUBLIC_BASE_PATH || '/spk-saw-hipertensi';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: repoBase,
  assetPrefix: `${repoBase}/`,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
  ignoreBuildErrors: true,
},

};

export default nextConfig;
