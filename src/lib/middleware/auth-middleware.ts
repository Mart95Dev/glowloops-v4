import { NextResponse } from 'next/server';

/**
 * Middleware d'authentification simplifié
 * Laisse la vérification d'authentification aux composants via useAuth
 */
export async function authMiddleware() {
  // Laisser passer toutes les requêtes et gérer l'auth côté client/composant
  return NextResponse.next();
}

// Configuration du middleware pour s'exécuter sur toutes les routes
export const config = {
  matcher: [
    '/((?!api|_next|.*\\.).*)',
  ],
}; 