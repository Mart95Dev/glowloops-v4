/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Désactiver le mode strict pour éviter les doubles rendus
  swcMinify: true,
  images: {
    domains: ['firebasestorage.googleapis.com', 'via.placeholder.com'], // Domaines autorisés pour les images
  },
  experimental: {
    // Options expérimentales
    serverComponentsExternalPackages: [],
  },
  webpack: (config) => {
    // Optimisations webpack
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

module.exports = nextConfig;
