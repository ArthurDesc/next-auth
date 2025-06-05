import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimisations de performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // Optimisations de compilation
  swcMinify: true,
  
  // Optimisations de bundle
  webpack: (config, { dev }) => {
    if (dev) {
      // Optimisations spécifiques au mode développement
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
  
  // Configuration pour les images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  
  // Optimisations PoweredByHeader
  poweredByHeader: false,
  
  // Compression
  compress: true,
};

export default nextConfig;
