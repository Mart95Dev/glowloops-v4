/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Désactiver le mode strict pour éviter les doubles rendus
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      }
    ], // Domaines autorisés pour les images
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
  eslint: {
    // Ignorer les erreurs ESLint en production pour les fichiers de debug
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignorer les erreurs TypeScript en production
    ignoreBuildErrors: true,
  },
  // Exclure les pages de debug et test lors du build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Personnaliser le comportement pour exclure les pages de debug
  onDemandEntries: {
    // Période pendant laquelle les pages sont conservées en mémoire
    maxInactiveAge: 25 * 1000,
    // Nombre de pages à conserver en mémoire
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig; 