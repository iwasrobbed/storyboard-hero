/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: 'localhost.foho.ai' }],
  },
  transpilePackages: ['@untitled-ui/icons-react'],
}

export default nextConfig
