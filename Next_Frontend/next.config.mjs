const backendUrl =
  process.env.BACKEND_INTERNAL_URL ||
  "https://iftekhar-mahmood-academic-portfolio.onrender.com";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
