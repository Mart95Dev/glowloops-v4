'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Pas besoin de redéclarer le type Window car il existe déjà

/**
 * Composant pour charger Google Analytics avec chargement optimisé
 * et suivi des changements de pages
 */
export default function Analytics() {
  const pathname = usePathname();
  
  // Suivre les changements de page
  useEffect(() => {
    if (GA_TRACKING_ID && typeof window !== 'undefined' && window.gtag) {
      // Utilisons le type tel qu'il est attendu par TypeScript
      window.gtag('event', 'page_view', {
        event_category: 'Page Navigation',
        event_label: pathname,
        value: 0,
        non_interaction: true
      });
    }
  }, [pathname]);
  
  // Ne rien rendre si l'ID n'est pas défini
  if (!GA_TRACKING_ID) return null;
  
  return (
    <>
      {/* Global Site Tag - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
              transport_type: 'beacon',
              anonymize_ip: true
            });
          `,
        }}
      />
    </>
  );
} 