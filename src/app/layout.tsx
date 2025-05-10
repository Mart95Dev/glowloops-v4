import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import { Header, Footer } from "@/components/layout";
import "./globals.css";
import { Toaster } from '@/components/ui/toast-utils';
import AuthInitializer from './_app';

// Désactiver le client-side JavaScript pour les composants qui ne sont pas explicitement marqués comme client
export const dynamic = 'force-static';
// Forcer le rendu statique pour éviter les problèmes de promesse
export const dynamicParams = false;

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GlowLoops | Bijoux en résine époxy faits main",
  description: "Boutique artisanale de bijoux en résine époxy personnalisés, faits à la main avec des matériaux de qualité.",
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
        className={`${playfairDisplay.variable} ${poppins.variable} antialiased`}
      >
        <AuthInitializer />
        <Header />
        <main className="pt-32 pb-16 min-h-screen">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
