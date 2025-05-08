import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// URLs qui nécessitent une authentification
const PROTECTED_PATHS = [
  '/mon-compte',
  '/mes-commandes',
  '/checkout',
];

// URLs d'authentification
const AUTH_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
];

/**
 * Middleware d'authentification pour protéger les routes
 * Utilise une approche compatible avec Edge Runtime
 */
export async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ne rien faire pour les ressources statiques
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }
  
  // Vérifier si l'URL est protégée
  const isProtectedPath = PROTECTED_PATHS.some(path => pathname.startsWith(path));
  const isAuthPath = AUTH_PATHS.some(path => pathname.startsWith(path));
  
  // Récupérer le cookie de session Firebase
  const sessionCookie = request.cookies.get('session')?.value;

  // Si l'utilisateur n'a pas de cookie de session et tente d'accéder à une route protégée
  if (!sessionCookie && isProtectedPath) {
    // Rediriger vers la page de connexion
    const url = new URL('/auth/login', request.url);
    // Stocker l'URL de redirection pour revenir après connexion
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  // Si l'utilisateur a un cookie de session et tente d'accéder à une page d'auth
  // Note: Nous ne vérifions pas la validité du cookie ici (sera fait côté client/serveur)
  if (sessionCookie && isAuthPath) {
    // Rediriger vers la page d'accueil
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Dans tous les autres cas, autoriser l'accès
  // La vérification réelle du token sera faite par les pages elles-mêmes
  return NextResponse.next();
}

// Configuration du middleware pour s'exécuter sur toutes les routes
export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf:
     * 1. Les routes /api (routes API)
     * 2. Les fichiers statiques (_next)
     * 3. Les fichiers avec extension (fichiers statiques)
     */
    '/((?!api|_next|.*\\.).*)',
  ],
}; 