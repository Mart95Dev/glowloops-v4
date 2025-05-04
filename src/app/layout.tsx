import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import { Header, Footer } from "@/components/layout";
import CartDrawer from "@/components/layout/CartDrawer";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GlowLoops - Bijoux Fantaisie Tendance",
  description: "Découvrez notre collection de bijoux fantaisie tendance et accessoires pour sublimer votre style au quotidien.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-FR" suppressHydrationWarning>
      <head />
      <body
        className={`${playfairDisplay.variable} ${poppins.variable} antialiased`}
      >
        <Header />
        <main className="pt-32 pb-16 min-h-screen">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
