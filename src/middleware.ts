import { authMiddleware } from './lib/middleware/auth-middleware';

export default authMiddleware;

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