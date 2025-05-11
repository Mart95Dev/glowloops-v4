'use client';

import { useState } from 'react';
import { User } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/Button';
import { userService } from '@/lib/firebase/user-service';
import { toast } from '@/lib/utils/toast';
import { Upload, X } from 'lucide-react';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

interface ProfileAvatarProps {
  user: User;
  onAvatarUpdate?: () => void;
}

export default function ProfileAvatar({ user, onAvatarUpdate }: ProfileAvatarProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.photoURL);
  
  // Gérer le changement de fichier
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Vérifier la taille du fichier (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 2Mo');
      return;
    }
    
    // Vérifier le type du fichier
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }
    
    // Création d'une URL pour la prévisualisation locale
    const localPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(localPreviewUrl);
    
    // Démarrer le téléchargement vers Firebase Storage
    setIsUploading(true);
    
    try {
      // Initialiser Firebase Storage
      const storage = getStorage();
      
      // Créer une référence unique pour l'avatar (userId + timestamp)
      const avatarFileName = `${user.uid}_${new Date().getTime()}`;
      const avatarExtension = file.name.split('.').pop() || 'jpg';
      // Utiliser le dossier avatars qui a maintenant les bonnes permissions
      const avatarPath = `avatars/${avatarFileName}.${avatarExtension}`;
      const avatarRef = ref(storage, avatarPath);
      
      // Télécharger le fichier vers Firebase Storage
      await uploadBytes(avatarRef, file);
      
      // Récupérer l'URL de téléchargement
      const downloadURL = await getDownloadURL(avatarRef);
      
      // Mettre à jour le profil avec la nouvelle photo dans Auth et Firestore
      await userService.updateUserProfile(user, {
        photoURL: downloadURL,
        avatarUrl: downloadURL
      });
      
      // Libérer l'URL locale de prévisualisation
      URL.revokeObjectURL(localPreviewUrl);
      
      // Mettre à jour l'URL de prévisualisation avec celle de Firebase
      setPreviewUrl(downloadURL);
      
      // Appeler le callback si fourni
      if (onAvatarUpdate) {
        onAvatarUpdate();
      }
      
      toast.success('Photo de profil mise à jour');
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'avatar:', error);
      toast.error('Erreur lors de la mise à jour de la photo de profil');
      
      // En cas d'erreur, revenir à l'URL précédente
      setPreviewUrl(user.photoURL);
      
      // Libérer l'URL locale
      URL.revokeObjectURL(localPreviewUrl);
    } finally {
      setIsUploading(false);
    }
  };
  
  // Supprimer la photo de profil
  const handleRemoveAvatar = async () => {
    try {
      setIsUploading(true);
      
      // Si l'URL actuelle provient de Firebase Storage, essayer de supprimer le fichier
      if (previewUrl && previewUrl.includes('firebasestorage.googleapis.com')) {
        try {
          // Tenter d'extraire le chemin du fichier depuis l'URL
          const storage = getStorage();
          const urlPath = previewUrl.split('/o/')[1]?.split('?')[0];
          
          if (urlPath) {
            const decodedPath = decodeURIComponent(urlPath);
            const fileRef = ref(storage, decodedPath);
            await deleteObject(fileRef);
          }
        } catch (storageError) {
          console.error('Erreur lors de la suppression du fichier:', storageError);
          // Continuer malgré l'erreur de suppression du fichier
        }
      }
      
      // Mettre à jour le profil pour supprimer la photo
      await userService.updateUserProfile(user, {
        photoURL: '',
        avatarUrl: null
      });
      
      // Réinitialiser la prévisualisation
      setPreviewUrl(null);
      
      // Appeler le callback si fourni
      if (onAvatarUpdate) {
        onAvatarUpdate();
      }
      
      toast.success('Photo de profil supprimée');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'avatar:', error);
      toast.error('Erreur lors de la suppression de la photo de profil');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Obtenir les initiales pour l'avatar de secours
  const getInitials = (): string => {
    if (user.displayName && user.displayName.length > 0) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user.email && user.email.length > 0) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Ouvrir la boîte de dialogue de sélection de fichier
  const handleButtonClick = () => {
    // Déclencher un clic sur l'input file caché
    document.getElementById('avatar-upload')?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <Avatar className="w-24 h-24 border-2 border-lilas-clair">
          <AvatarImage src={previewUrl || undefined} alt="Photo de profil" />
          <AvatarFallback className="bg-lilas-clair text-white text-xl">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <label htmlFor="avatar-upload" className="cursor-pointer p-2 rounded-full hover:bg-lilas-clair/20">
            <Upload className="w-5 h-5 text-white" />
            <span className="sr-only">Télécharger une photo</span>
          </label>
          
          {previewUrl && (
            <button 
              onClick={handleRemoveAvatar}
              className="p-2 rounded-full hover:bg-red-500/20 ml-2"
              disabled={isUploading}
            >
              <X className="w-5 h-5 text-white" />
              <span className="sr-only">Supprimer la photo</span>
            </button>
          )}
        </div>
      </div>
      
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
      
      <div className="text-center">
        <h3 className="font-medium">{user.displayName || 'Utilisateur'}</h3>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        type="button"
        onClick={handleButtonClick}
        disabled={isUploading}
        className="mt-2"
      >
        {isUploading ? 'Chargement...' : 'Changer de photo'}
      </Button>
    </div>
  );
} 