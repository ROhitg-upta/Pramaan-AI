/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    // Ignore during production builds to avoid blocking deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Typecheck is run via CI/CD step
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
