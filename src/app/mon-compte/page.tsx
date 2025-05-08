'use client';

import { useRequireAuth } from '@/lib/hooks/use-require-auth';

export default function ProfilePage() {
  // Protection de la route - redirige vers la connexion si non authentifié
  const { user, loading } = useRequireAuth('/mon-compte');
  
  // Afficher un état de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lilas-fonce">Chargement de votre profil...</p>
      </div>
    );
  }
  
  // Si l'utilisateur est connecté, afficher le profil
  if (user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-playfair text-lilas-fonce mb-6">Mon Compte</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Informations personnelles</h2>
            <div className="mt-4">
              <p><span className="font-medium">Nom:</span> {user.displayName || 'Non renseigné'}</p>
              <p><span className="font-medium">Email:</span> {user.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Commandes récentes */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Commandes récentes</h3>
              <p className="text-gray-600 text-sm">
                Vous n&apos;avez pas encore passé de commande.
              </p>
              <button className="mt-4 bg-lilas-clair text-white px-4 py-2 rounded-lg hover:bg-lilas-fonce transition-colors">
                Voir toutes mes commandes
              </button>
            </div>
            
            {/* Favoris */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Mes favoris</h3>
              <p className="text-gray-600 text-sm">
                Vous n&apos;avez pas encore ajouté d&apos;articles à vos favoris.
              </p>
              <button className="mt-4 bg-lilas-clair text-white px-4 py-2 rounded-lg hover:bg-lilas-fonce transition-colors">
                Voir mes favoris
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Ce cas ne devrait jamais se produire grâce au hook useRequireAuth
  return null;
} 