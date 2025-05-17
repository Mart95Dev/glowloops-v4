import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import { Header, Footer } from "@/components/layout";
import "./globals.css";
import { Toaster } from '@/components/ui/toast-utils';
import { Toaster as SonnerToaster } from 'sonner';
import AuthInitializer from './_app';
import FavoritesSync from '@/components/global/favorites-sync';
import dynamic from 'next/dynamic';

// Import dynamique des composants chargés côté client uniquement
const WebVitalsTracker = dynamic(
  () => import('@/components/performance/WebVitalsTracker'),
  { ssr: false }
);

const Analytics = dynamic(
  () => import('@/components/global/Analytics'),
  { ssr: false }
);

// Désactiver le client-side JavaScript pour les composants qui ne sont pas explicitement marqués comme client
export const dynamicRendering = 'force-static';
// Forcer le rendu statique pour éviter les problèmes de promesse
export const dynamicParams = false;

// Optimisation des polices avec préchargement pour les tailles critiques
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
  preload: true,
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: true, // Évite le CLS pendant le chargement
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'Arial', 'sans-serif'],
  adjustFontFallback: true, // Évite le CLS pendant le chargement
});

export const metadata: Metadata = {
  title: "GlowLoops | Bijoux en résine époxy faits main",
  description: "Boutique artisanale de bijoux en résine époxy personnalisés, faits à la main avec des matériaux de qualité.",
  // Désactivation temporaire de metadataBase pour éviter l'erreur
  // metadataBase: new URL(getBaseUrl()),
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
      <head />
      <body
        className={`${playfairDisplay.variable} ${poppins.variable} antialiased font-sans text-base bg-white`}
      >
        <AuthInitializer />
        <FavoritesSync />
        <WebVitalsTracker />
        <Analytics />
        <Header />
        <main className="pt-32 pb-16 min-h-screen">{children}</main>
        <Footer />
        <Toaster />
        <SonnerToaster position="top-right" richColors />
      </body>
    </html>
  );
}
