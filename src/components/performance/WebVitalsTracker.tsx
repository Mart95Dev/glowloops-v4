'use client';

import { useEffect } from 'react';
import { onCLS, onINP, onLCP, onFCP, onTTFB, Metric } from 'web-vitals';

/**
 * Composant qui suit les Core Web Vitals
 * CLS: Cumulative Layout Shift
 * INP: Interaction to Next Paint (remplace FID: First Input Delay)
 * LCP: Largest Contentful Paint
 * FCP: First Contentful Paint
 * TTFB: Time to First Byte
 */
export default function WebVitalsTracker() {
  useEffect(() => {
    // Fonction pour reporter les métriques
    const reportWebVitals = ({ name, delta, id, value }: Metric) => {
      // Envoyer à un service d'analytique si configuré
      const analyticsEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';
      
      if (analyticsEnabled) {
        // Exemple d'envoi à Google Analytics (remplacer par votre propre implémentation)
        if (typeof window.gtag === 'function') {
          window.gtag('event', name, {
            event_category: 'Web Vitals',
            event_label: id,
            value: Math.round(name === 'CLS' ? delta * 1000 : delta),
            non_interaction: true,
          });
        }
      }
      
      // Toujours logger en dev pour faciliter le débogage
      if (process.env.NODE_ENV === 'development') {
        console.log(`Web Vital: ${name}`, {
          id,
          value: name === 'CLS' ? value.toFixed(3) : `${Math.round(value)}ms`,
          delta: name === 'CLS' ? delta.toFixed(3) : `${Math.round(delta)}ms`,
        });
      }
    };
    
    // Enregistrer les observateurs pour chaque métrique
    onCLS(reportWebVitals);
    onINP(reportWebVitals);
    onLCP(reportWebVitals);
    onFCP(reportWebVitals);
    onTTFB(reportWebVitals);
    
    return () => {
      // Nettoyage si nécessaire
    };
  }, []);
  
  // Ce composant ne rend rien visuellement
  return null;
}

// Déclarer le type global pour gtag
declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params: {
        event_category: string,
        event_label: string,
        value: number,
        non_interaction: boolean
      }
    ) => void;
  }
} 