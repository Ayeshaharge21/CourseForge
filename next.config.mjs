/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Server Actions
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb', 
    },
  },


  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Unsplash 
      },
      {
        protocol: 'https',
        hostname: 'courseforge.com', 
      },
      {
        protocol: 'https',
        hostname: 'avatar.vercel.sh',
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
