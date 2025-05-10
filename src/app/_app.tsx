'use client';

import { useEffect } from 'react';
import { authService } from '@/lib/firebase/auth-service';

export function AuthInitializer() {
  useEffect(() => {
    console.log("🚀 AuthInitializer - Initialisation du système d'authentification");
    
    // Initialiser l'écouteur d'authentification
    const unsubscribe = authService.initAuthListener();
    
    // Nettoyage à la destruction du composant
    return () => {
      console.log("🧹 AuthInitializer - Nettoyage de l'écouteur d'authentification");
      unsubscribe();
    };
  }, []);
  
  // Ce composant ne rend rien visuellement
  return null;
}

export default AuthInitializer; 