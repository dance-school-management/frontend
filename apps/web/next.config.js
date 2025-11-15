/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        // TODO: Remove this pattern once we have a proper image solution
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
