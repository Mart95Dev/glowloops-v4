'use client';

import { useState } from 'react';
import { User } from 'firebase/auth';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userService } from '@/lib/firebase/user-service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from '@/lib/utils/toast';
import { Separator } from '@/components/ui/separator';

// Schéma pour changement de mot de passe
const passwordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, {
        message: 'Le mot de passe actuel doit comporter au moins 6 caractères',
      }),
    newPassword: z
      .string()
      .min(8, {
        message: 'Le nouveau mot de passe doit comporter au moins 8 caractères',
      })
      .regex(/[A-Z]/, {
        message: 'Le mot de passe doit contenir au moins une lettre majuscule',
      })
      .regex(/[a-z]/, {
        message: 'Le mot de passe doit contenir au moins une lettre minuscule',
      })
      .regex(/[0-9]/, {
        message: 'Le mot de passe doit contenir au moins un chiffre',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

// Schéma pour changement d'email
const emailFormSchema = z.object({
  newEmail: z
    .string()
    .email({
      message: 'Veuillez entrer une adresse email valide',
    }),
  password: z
    .string()
    .min(6, {
      message: 'Le mot de passe doit comporter au moins 6 caractères',
    }),
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;
type EmailFormValues = z.infer<typeof emailFormSchema>;

interface SecurityFormProps {
  user: User;
  onSecurityUpdate?: () => void;
}

export default function SecurityForm({ user, onSecurityUpdate }: SecurityFormProps) {
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [activeForm, setActiveForm] = useState<'password' | 'email' | null>(null);
  
  // Formulaire de mot de passe
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  
  // Formulaire d'email
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      newEmail: user.email || '',
      password: '',
    },
  });

  // Gérer le changement de mot de passe
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsPasswordLoading(true);
    
    try {
      const success = await userService.updateUserPassword(user, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      
      if (success) {
        passwordForm.reset();
        setActiveForm(null);
        
        if (onSecurityUpdate) {
          onSecurityUpdate();
        }
      }
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      toast.error('Erreur lors du changement de mot de passe');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  // Gérer le changement d'email
  const onEmailSubmit = async (data: EmailFormValues) => {
    setIsEmailLoading(true);
    
    try {
      if (data.newEmail === user.email) {
        toast.error('La nouvelle adresse email est identique à l\'actuelle');
        setIsEmailLoading(false);
        return;
      }
      
      const success = await userService.updateUserEmail(user, data.newEmail, data.password);
      
      if (success) {
        emailForm.reset({
          newEmail: data.newEmail,
          password: '',
        });
        setActiveForm(null);
        
        if (onSecurityUpdate) {
          onSecurityUpdate();
        }
      }
    } catch (error) {
      console.error('Erreur lors du changement d\'email:', error);
      toast.error('Erreur lors du changement d\'email');
    } finally {
      setIsEmailLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Section changement de mot de passe */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Mot de passe</h3>
          <Button
            variant={activeForm === 'password' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveForm(activeForm === 'password' ? null : 'password')}
          >
            {activeForm === 'password' ? 'Annuler' : 'Modifier'}
          </Button>
        </div>
        
        <Separator className="mb-4" />
        
        {activeForm === 'password' ? (
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe actuel*
              </label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Votre mot de passe actuel"
                disabled={isPasswordLoading}
                {...passwordForm.register('currentPassword')}
                className={passwordForm.formState.errors.currentPassword ? 'border-red-500' : ''}
              />
              {passwordForm.formState.errors.currentPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Nouveau mot de passe*
              </label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Votre nouveau mot de passe"
                disabled={isPasswordLoading}
                {...passwordForm.register('newPassword')}
                className={passwordForm.formState.errors.newPassword ? 'border-red-500' : ''}
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le nouveau mot de passe*
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirmer votre nouveau mot de passe"
                disabled={isPasswordLoading}
                {...passwordForm.register('confirmPassword')}
                className={passwordForm.formState.errors.confirmPassword ? 'border-red-500' : ''}
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isPasswordLoading || !passwordForm.formState.isDirty}
              >
                {isPasswordLoading ? 'Chargement...' : 'Changer le mot de passe'}
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-gray-500">
            Pour des raisons de sécurité, votre mot de passe n'est pas affiché. Utilisez le bouton modifier pour changer votre mot de passe.
          </p>
        )}
      </div>
      
      {/* Section changement d'email */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Adresse email</h3>
          <Button
            variant={activeForm === 'email' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveForm(activeForm === 'email' ? null : 'email')}
          >
            {activeForm === 'email' ? 'Annuler' : 'Modifier'}
          </Button>
        </div>
        
        <Separator className="mb-4" />
        
        <div className="mb-4">
          <p className="font-medium">Email actuel: <span className="font-normal">{user.email}</span></p>
        </div>
        
        {activeForm === 'email' ? (
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
            <div>
              <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Nouvelle adresse email*
              </label>
              <Input
                id="newEmail"
                type="email"
                placeholder="Votre nouvelle adresse email"
                disabled={isEmailLoading}
                {...emailForm.register('newEmail')}
                className={emailForm.formState.errors.newEmail ? 'border-red-500' : ''}
              />
              {emailForm.formState.errors.newEmail && (
                <p className="mt-1 text-xs text-red-500">
                  {emailForm.formState.errors.newEmail.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe actuel* (pour confirmer)
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Votre mot de passe actuel"
                disabled={isEmailLoading}
                {...emailForm.register('password')}
                className={emailForm.formState.errors.password ? 'border-red-500' : ''}
              />
              {emailForm.formState.errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {emailForm.formState.errors.password.message}
                </p>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isEmailLoading || !emailForm.formState.isDirty}
              >
                {isEmailLoading ? 'Chargement...' : 'Changer l&apos;email'}
              </Button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
} 