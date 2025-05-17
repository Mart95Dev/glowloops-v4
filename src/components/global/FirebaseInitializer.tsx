'use client';

import { useEffect, useState } from 'react';
import { preloadFirebaseModules } from '@/lib/firebase/firebase-lazy';

/**
 * Composant pour initialiser Firebase de manière différée
 * Ce composant doit être inclus dans layout.tsx, de préférence en bas de page
 * pour ne pas bloquer le rendu initial
 */
export default function FirebaseInitializer() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Ne charger les modules que lorsque l'utilisateur est inactif ou après un délai
    const timer = setTimeout(() => {
      // Vérifier si l'utilisateur a interagi avec la page
      if (document.visibilityState === 'visible') {
        const initializeFirebase = () => {
          // Précharger les modules Firebase mais de manière non-bloquante
          preloadFirebaseModules();
          setIsInitialized(true);
        };

        // Utiliser requestIdleCallback si disponible, sinon setTimeout
        if ('requestIdleCallback' in window) {
          (window as Window).requestIdleCallback(initializeFirebase, { timeout: 5000 });
        } else {
          setTimeout(initializeFirebase, 3000);
        }
      }
    }, 2000); // Attendre 2 secondes après le chargement initial

    // Si l'utilisateur fait défiler la page, initialiser Firebase plus rapidement
    const handleScroll = () => {
      clearTimeout(timer);
      if (!isInitialized) {
        preloadFirebaseModules();
        setIsInitialized(true);
      }
      // Retirer l'écouteur d'événement après initialisation
      window.removeEventListener('scroll', handleScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isInitialized]);

  // Ce composant ne rend rien, il est uniquement utilisé pour ses effets secondaires
  return null;
} 