import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from '@/components/ui/toast-utils';
import { Toaster as SonnerToaster } from 'sonner';
import dynamic from 'next/dynamic';

// Charger les composants critiques directement
import { Header } from "@/components/layout";

// Lazy-load des composants non-critiques
const Footer = dynamic(() => import('@/components/layout').then(mod => mod.Footer), { ssr: true });
const AuthInitializer = dynamic(() => import('./_app'), { ssr: false });
const FavoritesSync = dynamic(() => import('@/components/global/favorites-sync'), { ssr: false });

// Import dynamique des composants chargés côté client uniquement avec une forte priorité de chargement différé
const WebVitalsTracker = dynamic(
  () => import('@/components/performance/WebVitalsTracker'),
  { ssr: false, loading: () => null }
);

const Analytics = dynamic(
  () => import('@/components/global/Analytics'),
  { ssr: false, loading: () => null }
);

// Désactiver le client-side JavaScript pour les composants qui ne sont pas explicitement marqués comme client
export const dynamicRendering = 'force-static';
// Forcer le rendu statique pour éviter les problèmes de promesse
export const dynamicParams = false;
// Activer l'ISR pour permettre une génération statique avec revalidation périodique
export const revalidate = 3600; // 1 heure

// Optimisation des polices avec préchargement pour les tailles critiques
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: true,
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600"],
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'Arial', 'sans-serif'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "GlowLoops | Bijoux en résine époxy faits main",
  description: "Boutique artisanale de bijoux en résine époxy personnalisés, faits à la main avec des matériaux de qualité.",
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: '/',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Préchargement des ressources critiques */}
        <link 
          rel="preconnect" 
          href="https://firebasestorage.googleapis.com" 
          crossOrigin="anonymous" 
        />
        <link 
          rel="dns-prefetch" 
          href="https://firebasestorage.googleapis.com" 
        />
      </head>
      <body
        className={`${playfairDisplay.variable} ${poppins.variable} antialiased font-sans text-base bg-white`}
      >
        <Header />
        <main className="pt-32 pb-16 min-h-screen">{children}</main>
        <Footer />
        
        {/* Composants non-critiques chargés après le contenu principal */}
        <AuthInitializer />
        <FavoritesSync />
        <Toaster />
        <SonnerToaster position="top-right" richColors />
        
        {/* Composants analytiques chargés en dernier */}
        <WebVitalsTracker />
        <Analytics />
      </body>
    </html>
  );
}
