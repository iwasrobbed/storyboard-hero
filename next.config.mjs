/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: '*.googleusercontent.com' },
      { hostname: '*.google.com' },
      { hostname: 'storyboard-hero-public-assets.s3.amazonaws.com' },
      { hostname: 'storyboard-hero-assets.s3.amazonaws.com' },
      { hostname: 'storyboard-hero-localhost.s3.amazonaws.com' },
    ],
  },
  transpilePackages: ['@untitled-ui/icons-react'],
}

export default nextConfig
