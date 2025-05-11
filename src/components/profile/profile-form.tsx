'use client';

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userService } from '@/lib/firebase/user-service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from '@/lib/utils/toast';

// Schéma de validation
const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: 'Le prénom doit comporter au moins 2 caractères',
    })
    .max(30, {
      message: 'Le prénom ne doit pas dépasser 30 caractères',
    }),
  lastName: z
    .string()
    .min(2, {
      message: 'Le nom doit comporter au moins 2 caractères',
    })
    .max(30, {
      message: 'Le nom ne doit pas dépasser 30 caractères',
    }),
  phoneNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^(\+33|0)[1-9](\d{2}){4}$/.test(val), {
      message: 'Numéro de téléphone invalide',
    }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  user: User;
  onProfileUpdate?: () => void;
}

export default function ProfileForm({ user, onProfileUpdate }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<ProfileFormValues>({
    firstName: '',
    lastName: '',
    phoneNumber: user.phoneNumber || '',
  });
  
  // Créer le formulaire avec react-hook-form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialData,
  });
  
  // Charger les données utilisateur depuis Firestore
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await userService.getUserData(user.uid);
        
        if (userData) {
          const formData = {
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            phoneNumber: userData.phoneNumber || '',
          };
          
          setInitialData(formData);
          form.reset(formData);
        } else if (user.displayName) {
          // Extraire prénom/nom du displayName si disponible
          const nameParts = user.displayName.split(' ');
          const formData = {
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            phoneNumber: user.phoneNumber || '',
          };
          
          setInitialData(formData);
          form.reset(formData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
        toast.error('Erreur lors du chargement des données');
      }
    };
    
    loadUserData();
  }, [user, form]);
  
  // Gérer la soumission du formulaire
  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    
    try {
      // Préparer les données pour la mise à jour
      const profileData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber || '',
        displayName: `${data.firstName} ${data.lastName}`.trim(),
      };
      
      // Mettre à jour le profil utilisateur
      const success = await userService.updateUserProfile(user, profileData);
      
      if (success) {
        // Appeler le callback si fourni
        if (onProfileUpdate) {
          onProfileUpdate();
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label 
            htmlFor="firstName" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Prénom*
          </label>
          <Input
            id="firstName"
            placeholder="Votre prénom"
            disabled={isLoading}
            {...form.register('firstName')}
            className={form.formState.errors.firstName ? 'border-red-500' : ''}
          />
          {form.formState.errors.firstName && (
            <p className="mt-1 text-xs text-red-500">
              {form.formState.errors.firstName.message}
            </p>
          )}
        </div>
        
        <div>
          <label 
            htmlFor="lastName" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nom*
          </label>
          <Input
            id="lastName"
            placeholder="Votre nom"
            disabled={isLoading}
            {...form.register('lastName')}
            className={form.formState.errors.lastName ? 'border-red-500' : ''}
          />
          {form.formState.errors.lastName && (
            <p className="mt-1 text-xs text-red-500">
              {form.formState.errors.lastName.message}
            </p>
          )}
        </div>
        
        <div>
          <label 
            htmlFor="phoneNumber" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Téléphone
          </label>
          <Input
            id="phoneNumber"
            placeholder="Votre numéro de téléphone"
            disabled={isLoading}
            {...form.register('phoneNumber')}
            className={form.formState.errors.phoneNumber ? 'border-red-500' : ''}
          />
          {form.formState.errors.phoneNumber && (
            <p className="mt-1 text-xs text-red-500">
              {form.formState.errors.phoneNumber.message}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Format: 0612345678 ou +33612345678
          </p>
        </div>
        
        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <Input
            id="email"
            value={user.email || ''}
            disabled={true}
            className="bg-gray-50"
          />
          <p className="mt-1 text-xs text-gray-500">
            Pour modifier votre email, utilisez la section &quot;Paramètres de sécurité&quot;
          </p>
        </div>
      </div>
      
      <Button
        type="submit"
        disabled={isLoading || !form.formState.isDirty}
        className="w-full sm:w-auto"
      >
        {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
      </Button>
    </form>
  );
} 