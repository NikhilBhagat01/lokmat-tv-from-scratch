/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's1.dmcdn.net',
      },
      {
        protocol: 'https',
        hostname: 's2.dmcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'www.dailymotion.com',
      },
    ],
  },
};

export default nextConfig;
