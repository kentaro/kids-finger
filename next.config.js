/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '/kids-finger',
  assetPrefix: `${process.env.NEXT_PUBLIC_BASE_PATH || '/kids-finger'}/`,
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig