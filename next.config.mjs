/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['themes.pixelstrap.com', 'via.placeholder.com', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
