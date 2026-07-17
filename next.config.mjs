/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Server Actions (Next 14 में डिफॉल्ट है, पर स्पष्ट रखना अच्छा है)
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb', // फ्यूचर लेसन कंटेंट अपलोड्स के लिए
    },
  },

  // बाहरी इमेजेस (Thumbnails, Avatars) को अलाउ करने के लिए
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '://unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '://courseforge.com',
      },
      {
        protocol: 'https',
        hostname: 'avatar.vercel.sh',
      },
    ],
  },

  // बिल्ड के समय TypeScript एरर्स को अस्थायी रूप से अनदेखा करने के लिए (अगर बिल्ड ब्लॉक हो रहा हो)
  typescript: {
    ignoreBuildErrors: true,
  },
  // बिल्ड के समय ESLint वार्निंग्स को अनदेखा करने के लिए
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
