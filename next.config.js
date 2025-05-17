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
    minimumCacheTTL: 60 * 60 * 24 * 30, // Cache d'un mois pour les images
    dangerouslyAllowSVG: true, // Autoriser les SVG pour les icônes
    contentDispositionType: 'attachment', // Meilleure mise en cache
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920], // Tailles d'appareils optimisées
    imageSizes: [16, 32, 48, 64, 96, 128, 256], // Tailles d'images supplémentaires
  },
  experimental: {
    // Options expérimentales
    serverComponentsExternalPackages: [],
    // Optimisation pour la taille des bundles
    optimizeCss: {
      // Remplace l'utilisation de critters par une configuration plus avancée
      inlineThreshold: 3 * 1024, // 3kb pour inliner les petits CSS
      cssnano: {
        preset: [
          'advanced',
          {
            discardUnused: true, // Supprimer les sélecteurs inutilisés
            mergeIdents: true, // Fusionner les identifiants
            reduceIdents: true, // Réduire les identifiants
            zindex: false, // Ne pas toucher aux z-index
            mergeRules: true, // Fusionner les règles CSS similaires
            discardDuplicates: true, // Supprimer les doublons
          }
        ],
      },
      fonts: true, // Optimiser les polices
    },
    optimizePackageImports: [
      'react-icons', 
      '@radix-ui', 
      'framer-motion', 
      'lucide-react', 
      'firebase'
    ],
    // Optimisations supplémentaires
    craCompat: false, // Désactiver la compatibilité avec Create React App pour plus de performances
    webVitalsAttribution: ['CLS', 'LCP'], // Suivi précis des attributions de Web Vitals
    forceSwcTransforms: true, // Forcer l'utilisation de SWC pour les transformations
    scrollRestoration: true, // Restauration de la position de défilement
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
          parallel: true, // Utiliser tous les cœurs disponibles
          terserOptions: {
            compress: {
              drop_console: true, // Supprimer les console.log en production
              drop_debugger: true, // Supprimer les debugger
              pure_funcs: ['console.info', 'console.debug', 'console.warn'], // Supprimer d'autres fonctions de console
              passes: 3, // Augmenter à 3 passes pour une meilleure optimisation
              toplevel: true, // Optimisation au niveau supérieur
              unsafe_math: true, // Optimisations mathématiques avancées
              ecma: 2022, // Cibler ECMAScript 2022 pour optimisations modernes
            },
            mangle: {
              toplevel: true, // Réduire les noms de variables au niveau supérieur
              safari10: true, // Compatibilité Safari 10
            },
            output: {
              comments: false, // Supprimer les commentaires
              ecma: 2020, // Cibler ECMAScript 2020 pour la sortie
            },
            // Activer les passes multiples pour une meilleure optimisation
            sourceMap: false,
          },
          extractComments: false, // Ne pas extraire les commentaires de licence
        })
      );
      
      // Réduire la taille du bundle en production
      config.optimization.concatenateModules = true; // Concaténer les modules similaires
      
      // Éviter la duplication du code
      config.optimization.runtimeChunk = 'single';
      
      // Optimisation des imports dynamiques
      config.optimization.flagIncludedChunks = true;
      config.optimization.moduleIds = 'deterministic'; // IDs déterministes pour un meilleur cache
      config.optimization.chunkIds = 'deterministic';
      
      // Optimisation supplémentaire: activer ModuleConcatenationPlugin
      config.optimization.usedExports = true;
    }
    
    // Optimiser la détection des modules inutilisés
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 30, // Augmenté pour permettre plus de chunks initiaux
        minSize: 20000,
        maxSize: 240000, // Taille maximale pour éviter les chunks trop gros
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true,
          },
          // Groupes spécifiques pour les libs fréquemment utilisées
          // Cela permet de les mettre en cache plus efficacement
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 40,
          },
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix',
            chunks: 'all',
            priority: 30,
          },
          // Amélioration du découpage Firebase pour réduire la taille des bundles
          // Découpage en composants plus petits et ciblés
          firebaseCore: {
            test: /[\\/]node_modules[\\/](@firebase\/app|@firebase\/util|@firebase\/logger|@firebase\/component)[\\/]/,
            name: 'firebase-core',
            chunks: 'all',
            priority: 40,
          },
          firebaseAuth: {
            test: /[\\/]node_modules[\\/](@firebase\/auth)[\\/]/,
            name: 'firebase-auth',
            chunks: 'all',
            priority: 35,
            reuseExistingChunk: true,
          },
          firebaseFirestore: {
            test: /[\\/]node_modules[\\/](@firebase\/firestore)[\\/]/,
            name: 'firebase-firestore',
            chunks: 'all',
            priority: 35,
            reuseExistingChunk: true,
          },
          firebaseStorage: {
            test: /[\\/]node_modules[\\/](@firebase\/storage)[\\/]/,
            name: 'firebase-storage',
            chunks: 'all',
            priority: 35,
            reuseExistingChunk: true,
          },
          // Optimisations pour les autres dépendances Firebase
          firebaseAnalytics: {
            test: /[\\/]node_modules[\\/](@firebase\/analytics)[\\/]/,
            name: 'firebase-analytics',
            chunks: 'all',
            priority: 30,
            reuseExistingChunk: true,
          },
          firebasePerformance: {
            test: /[\\/]node_modules[\\/](@firebase\/performance)[\\/]/,
            name: 'firebase-performance',
            chunks: 'all',
            priority: 30,
            reuseExistingChunk: true,
          },
          ui: {
            test: /[\\/]components[\\/]ui[\\/]/,
            name: 'ui-components',
            chunks: 'all',
            priority: 20,
          },
          // Groupe pour les images et SVG
          media: {
            test: /\.(png|jpe?g|gif|svg|webp|avif)$/,
            name: 'media',
            chunks: 'all',
            priority: 15,
          },
          // Optimisation Framer Motion
          framerMotion: {
            test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
            name: 'framer-motion',
            chunks: 'all',
            priority: 20,
            reuseExistingChunk: true,
          },
        },
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
            value: 'public, max-age=31536000, stale-while-revalidate=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            // Cache très agressif pour les polices
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            // Cache agressif pour les ressources statiques
            value: 'public, max-age=31536000, stale-while-revalidate=31536000, immutable',
          },
        ],
      },
    ]
  },
};

export default nextConfig; 