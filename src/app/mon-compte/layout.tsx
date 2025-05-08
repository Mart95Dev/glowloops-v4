'use client';

import { useState, useEffect } from 'react';
import { useRequireAuth } from '@/lib/hooks/use-require-auth';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, ShoppingBag, Heart, MapPin, Bell, LogOut, Menu, X } from 'lucide-react';
import { authService } from '@/lib/firebase/auth-service';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protection de la route - redirige vers la connexion si non authentifié
  const { user, loading } = useRequireAuth('/mon-compte');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Vérification supplémentaire pour s'assurer que nous avons un utilisateur valide
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      console.log("Layout Compte - Utilisateur authentifié:", currentUser.email);
    } else {
      console.log("Layout Compte - Aucun utilisateur authentifié");
    }
  }, []);

  // Fermer le menu mobile lors du changement de page
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navItems: NavItem[] = [
    {
      label: 'Tableau de bord',
      href: '/mon-compte',
      icon: <User className="w-5 h-5" />,
    },
    {
      label: 'Mes commandes',
      href: '/mon-compte/commandes',
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      label: 'Mes favoris',
      href: '/mon-compte/favoris',
      icon: <Heart className="w-5 h-5" />,
    },
    {
      label: 'Mes adresses',
      href: '/mon-compte/adresses',
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      label: 'Notifications',
      href: '/mon-compte/notifications',
      icon: <Bell className="w-5 h-5" />,
    },
  ];

  async function handleLogout() {
    try {
      await authService.signOut();
      // Redirection manuelle après déconnexion
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }

  // Afficher un état de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lilas-fonce">Chargement de votre espace client...</p>
      </div>
    );
  }

  // Double vérification que l'utilisateur est bien authentifié
  if (!user && !loading) {
    console.log("Redirection vers la page de connexion depuis le layout...");
    router.push('/auth/login?redirectTo=/mon-compte');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header mobile */}
      <div className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between">
        <h1 className="text-xl font-playfair text-lilas-fonce">Mon Espace</h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-lilas-fonce" />
          ) : (
            <Menu className="w-6 h-6 text-lilas-fonce" />
          )}
        </button>
      </div>

      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar navigation - version mobile (drawer) */}
        <aside
          className={`${
            mobileMenuOpen ? 'fixed inset-0 z-50 block' : 'hidden'
          } md:hidden`}
        >
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <nav className="fixed top-0 bottom-0 left-0 w-64 bg-white shadow-lg p-4 overflow-y-auto z-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-playfair text-lilas-fonce">Menu</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Fermer le menu"
              >
                <X className="w-5 h-5 text-lilas-fonce" />
              </button>
            </div>
            <div className="mb-6 pb-4 border-b border-gray-200">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-lilas-clair rounded-full flex items-center justify-center text-white text-xl mb-2">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                </div>
                <p className="font-medium">{user?.displayName || 'Client'}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      pathname === item.href
                        ? 'bg-lilas-clair/10 text-lilas-fonce font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-4 mt-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Se déconnecter
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Sidebar navigation - version desktop */}
        <aside className="hidden md:block w-64 bg-white rounded-lg shadow-sm p-4 h-fit sticky top-20">
          <div className="mb-6 pb-4 border-b border-gray-200">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-lilas-clair rounded-full flex items-center justify-center text-white text-xl mb-2">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
              </div>
              <p className="font-medium">{user?.displayName || 'Client'}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <nav>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      pathname === item.href
                        ? 'bg-lilas-clair/10 text-lilas-fonce font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-4 mt-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Se déconnecter
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-white rounded-lg shadow-sm p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 