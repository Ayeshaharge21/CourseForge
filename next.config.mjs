/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Server Actions - already default in Next 14, but explicit is good
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb', // For future: lesson content uploads
    },
  },

  // Allow external images for course thumbnails, avatars, etc
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.courseforge.com', // For future S3/Cloudflare R2
      },
      {
        protocol: 'https',
        hostname: 'avatar.vercel.sh', // For default avatars
      },
    ],
  },

  // Optional: Redirect / to /dashboard if logged in later
  // async redirects() {
  //   return []
  // }

  // TypeScript and ESLint checks during build
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;