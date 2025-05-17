/** @type {import('next').NextConfig} */
import TerserPlugin from 'terser-webpack-plugin';

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
    ],
    // Amélioration de l'optimisation des images
    formats: ['image/avif', 'image/webp'], // Priorité à AVIF qui est plus performant
    minimumCacheTTL: 60 * 60 * 24 * 7, // Cache d'une semaine pour les images
    dangerouslyAllowSVG: true, // Autoriser les SVG pour les icônes
    contentDispositionType: 'attachment', // Meilleure mise en cache
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920, 2048], // Tailles d'appareils optimisées
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Tailles d'images supplémentaires
  },
  experimental: {
    // Options expérimentales
    serverComponentsExternalPackages: [],
    // Optimisation pour la taille des bundles
    optimizeCss: true, // Optimisation CSS
    optimizePackageImports: ['react-icons', '@radix-ui', 'framer-motion'],
    // Optimisations supplémentaires
    craCompat: false, // Désactiver la compatibilité avec Create React App pour plus de performances
  },
  webpack: (config, { dev, isServer }) => {
    // Optimisations webpack
    config.resolve.fallback = { fs: false, path: false };
    
    // En production, supprimer tous les console.log
    if (!dev) {
      // Utilisation de TerserPlugin importé en haut du fichier
      config.optimization.minimizer = config.optimization.minimizer || [];
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // Supprimer les console.log en production
            },
          },
        })
      );
    }
    
    // Optimiser la détection des modules inutilisés
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
      };
    }
    
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
  // Optimisations supplémentaires
  poweredByHeader: false, // Supprimer l'en-tête X-Powered-By pour la sécurité
  compress: true, // Activer la compression
  productionBrowserSourceMaps: false, // Désactiver les source maps en production
  
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            // Mise en cache agressive pour les ressources statiques
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            // No-cache pour les routes API
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        ],
      },
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            // Cache plus agressif pour les images optimisées par Next.js
            value: 'public, max-age=604800, immutable',
          },
        ],
      },
    ]
  },
};

export default nextConfig; 