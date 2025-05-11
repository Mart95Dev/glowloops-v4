'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/firebase/auth';
import { useUserData } from '@/lib/hooks/use-user-data';
import { useRouter } from 'next/navigation';
import ProfileAvatar from '@/components/profile/profile-avatar';
import ProfileForm from '@/components/profile/profile-form';
import SecurityForm from '@/components/profile/security-form';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/lib/utils/toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { loading: userDataLoading } = useUserData();

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Vous devez être connecté pour accéder à cette page');
      router.push('/connexion');
    }
  }, [user, authLoading, router]);

  // Afficher un loader pendant le chargement
  if (authLoading || userDataLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner />
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, ne rien afficher (la redirection est gérée par l'effet)
  if (!user) {
    return null;
  }

  const handleProfileUpdate = () => {
    toast.success('Profil mis à jour avec succès');
  };

  const handleSecurityUpdate = () => {
    toast.success('Paramètres de sécurité mis à jour avec succès');
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Mon profil</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne de gauche: Avatar et informations de base */}
          <div className="lg:col-span-1">
            <ProfileAvatar user={user} onAvatarUpdate={handleProfileUpdate} />
          </div>
          
          {/* Colonne de droite: Formulaire d'édition */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
            <Separator className="mb-6" />
            <ProfileForm user={user} onProfileUpdate={handleProfileUpdate} />
          </div>
        </div>
      </div>
      
      {/* Section de sécurité */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Paramètres de sécurité</h2>
        <Separator className="mb-6" />
        <SecurityForm user={user} onSecurityUpdate={handleSecurityUpdate} />
      </div>
      
      {/* Section des préférences */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Préférences</h2>
        <Separator className="mb-6" />
        
        <p className="text-gray-500 italic">
          Les préférences de communication seront disponibles prochainement.
        </p>
      </div>
    </div>
  );
} 