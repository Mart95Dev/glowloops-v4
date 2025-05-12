'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Check, X, Copy, Eye } from 'lucide-react';
import { useWishlistPublic } from '@/lib/store/favoritesStore';
import { toast } from '@/lib/utils/toast';
import { Button } from '@/components/ui/Button';
import { WishlistShareOptions } from './wishlist-share-options';
import type { WishlistSettings } from '@/lib/store/favoritesStore';

type WishlistFormValues = Omit<WishlistSettings, 'updatedAt'>;

export function WishlistSettings() {
  const { wishlistSettings, setWishlistSettings, generateSlug, getPublicWishlistUrl } = useWishlistPublic();
  const [slugAvailable, setSlugAvailable] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  const { register, handleSubmit, watch, setValue, formState: { errors, isDirty } } = useForm<WishlistFormValues>({
    defaultValues: {
      isPublic: wishlistSettings?.isPublic || false,
      title: wishlistSettings?.title || 'Ma wishlist',
      slug: wishlistSettings?.slug || '',
      message: wishlistSettings?.message || '',
      theme: wishlistSettings?.theme || 'classic'
    }
  });
  
  // Observer les changements de slug pour vérifier la disponibilité
  const slug = watch('slug');
  const title = watch('title');
  
  // Mettre à jour le formulaire quand les paramètres de wishlist changent
  useEffect(() => {
    if (wishlistSettings) {
      setValue('isPublic', wishlistSettings.isPublic);
      setValue('title', wishlistSettings.title);
      setValue('slug', wishlistSettings.slug);
      setValue('message', wishlistSettings.message || '');
      setValue('theme', wishlistSettings.theme);
    }
  }, [wishlistSettings, setValue]);
  
  // Générer un slug automatiquement si nécessaire
  useEffect(() => {
    const generateSlugFromTitle = async () => {
      if (title && (!slug || slug === '')) {
        setIsChecking(true);
        try {
          const newSlug = await generateSlug(title);
          setValue('slug', newSlug);
          setSlugAvailable(true);
        } catch (error) {
          console.error('Erreur lors de la génération du slug:', error);
        } finally {
          setIsChecking(false);
        }
      }
    };
    
    generateSlugFromTitle();
  }, [watch, title, slug, generateSlug, setValue]);
  
  // Soumettre le formulaire
  const onSubmit = async (data: WishlistFormValues) => {
    try {
      const success = await setWishlistSettings(data);
      if (success) {
        toast.success('Paramètres de wishlist enregistrés');
        
        // Si la wishlist est publique, proposer le partage
        if (data.isPublic) {
          setShowShareOptions(true);
        }
      } else {
        toast.error('Erreur lors de l\'enregistrement des paramètres');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Une erreur est survenue');
    }
  };
  
  // Copier le lien de la wishlist
  const copyWishlistLink = () => {
    const url = getPublicWishlistUrl();
    if (url) {
      navigator.clipboard.writeText(url);
      toast.success('Lien copié dans le presse-papiers');
    } else {
      toast.error('Aucun lien disponible. Activez la wishlist publique d\'abord.');
    }
  };
  
  // Aperçu de la wishlist
  const viewWishlist = () => {
    const url = getPublicWishlistUrl();
    if (url) {
      window.open(url, '_blank');
    } else {
      toast.error('Aucun lien disponible. Activez la wishlist publique d\'abord.');
    }
  };
  
  const themeOptions = [
    { value: 'classic', label: 'Classique' },
    { value: 'modern', label: 'Moderne' },
    { value: 'elegant', label: 'Élégant' },
    { value: 'festive', label: 'Festif' },
    { value: 'minimal', label: 'Minimaliste' }
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white p-5 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold mb-4">Paramètres de ma wishlist</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Activer la wishlist publique */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublic"
              className="h-4 w-4 text-lilas-fonce rounded focus:ring-lilas-clair"
              {...register('isPublic')}
            />
            <label htmlFor="isPublic" className="text-sm font-medium">
              Activer ma wishlist publique
            </label>
          </div>
          
          {/* Titre de la wishlist */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Titre de la wishlist
            </label>
            <input
              type="text"
              id="title"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lilas-clair"
              {...register('title', { required: 'Le titre est requis' })}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>
          
          {/* Slug personnalisé */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-1">
              URL personnalisée
            </label>
            <div className="flex items-center">
              <span className="bg-gray-100 px-3 py-2 rounded-l-md border border-r-0 text-gray-500 text-sm">
                {typeof window !== 'undefined' ? `${window.location.origin}/wishlist/` : '/wishlist/'}
              </span>
              <input
                type="text"
                id="slug"
                className={`flex-1 px-3 py-2 border rounded-r-md focus:outline-none focus:ring-2 ${
                  slugAvailable ? 'focus:ring-green-400 border-green-400' : 'focus:ring-red-400 border-red-400'
                }`}
                {...register('slug', { required: 'L\'URL personnalisée est requise' })}
              />
              {isChecking ? (
                <span className="ml-2 text-gray-500">Vérification...</span>
              ) : (
                slugAvailable ? (
                  <Check className="ml-2 text-green-500 h-5 w-5" />
                ) : (
                  <X className="ml-2 text-red-500 h-5 w-5" />
                )
              )}
            </div>
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Choisissez une URL unique pour votre wishlist
            </p>
          </div>
          
          {/* Message personnel */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Message personnel (optionnel)
            </label>
            <textarea
              id="message"
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lilas-clair"
              placeholder="Un petit message à partager avec votre wishlist..."
              {...register('message')}
            ></textarea>
          </div>
          
          {/* Thème visuel */}
          <div>
            <label htmlFor="theme" className="block text-sm font-medium mb-1">
              Thème visuel
            </label>
            <select
              id="theme"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-lilas-clair"
              {...register('theme')}
            >
              {themeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button 
              type="submit" 
              className="bg-lilas-fonce hover:bg-lilas-clair text-white"
              disabled={!isDirty}
            >
              Enregistrer les paramètres
            </Button>
            
            {wishlistSettings?.isPublic && (
              <>
                <Button 
                  type="button" 
                  className="bg-white border border-lilas-fonce text-lilas-fonce hover:bg-lilas-fonce/10"
                  onClick={copyWishlistLink}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copier le lien
                </Button>
                
                <Button 
                  type="button" 
                  className="bg-white border border-lilas-fonce text-lilas-fonce hover:bg-lilas-fonce/10"
                  onClick={viewWishlist}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Aperçu
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
      
      {/* Options de partage */}
      {showShareOptions && wishlistSettings?.isPublic && (
        <WishlistShareOptions 
          url={getPublicWishlistUrl() || ''}
          title={wishlistSettings.title}
          onClose={() => setShowShareOptions(false)}
        />
      )}
    </div>
  );
} 