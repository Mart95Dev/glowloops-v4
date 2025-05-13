'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema, AddressFormValues } from '@/lib/types/schemas';
import { UserAddress } from '@/lib/store/user-store';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface AddressFormProps {
  onSubmit: (data: AddressFormValues) => void;
  onCancel: () => void;
  initialValues?: Partial<UserAddress>;
  isLoading?: boolean;
  isEditing?: boolean;
}

export default function AddressForm({
  onSubmit,
  onCancel,
  initialValues,
  isLoading = false,
  isEditing = false
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AddressFormValues>({
    // @ts-expect-error - Erreur de typage connue avec zodResolver et isDefault optionnel
    resolver: zodResolver(addressSchema),
    defaultValues: {
      nom: initialValues?.nom || '',
      prenom: initialValues?.prenom || '',
      adresse: initialValues?.adresse || '',
      complementAdresse: initialValues?.complementAdresse || '',
      codePostal: initialValues?.codePostal || '',
      ville: initialValues?.ville || '',
      pays: initialValues?.pays || 'France',
      telephone: initialValues?.telephone || '',
      isDefault: initialValues?.isDefault ?? false
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-playfair text-lg text-lilas-fonce">
          {isEditing ? 'Modifier l&apos;adresse' : 'Ajouter une adresse'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Fermer le formulaire"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* @ts-expect-error - Erreur de typage connue avec handleSubmit et la fonction onSubmit */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
              Prénom <span className="text-red-500">*</span>
            </label>
            <input
              id="prenom"
              type="text"
              disabled={isLoading}
              {...register('prenom')}
              className={`w-full p-2 border rounded-md ${errors.prenom ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.prenom && (
              <p className="mt-1 text-sm text-red-500">{errors.prenom.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              id="nom"
              type="text"
              disabled={isLoading}
              {...register('nom')}
              className={`w-full p-2 border rounded-md ${errors.nom ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.nom && (
              <p className="mt-1 text-sm text-red-500">{errors.nom.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1">
            Adresse <span className="text-red-500">*</span>
          </label>
          <input
            id="adresse"
            type="text"
            disabled={isLoading}
            {...register('adresse')}
            className={`w-full p-2 border rounded-md ${errors.adresse ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.adresse && (
            <p className="mt-1 text-sm text-red-500">{errors.adresse.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="complementAdresse" className="block text-sm font-medium text-gray-700 mb-1">
            Complément d&apos;adresse
          </label>
          <input
            id="complementAdresse"
            type="text"
            disabled={isLoading}
            {...register('complementAdresse')}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="codePostal" className="block text-sm font-medium text-gray-700 mb-1">
              Code postal <span className="text-red-500">*</span>
            </label>
            <input
              id="codePostal"
              type="text"
              disabled={isLoading}
              {...register('codePostal')}
              className={`w-full p-2 border rounded-md ${errors.codePostal ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.codePostal && (
              <p className="mt-1 text-sm text-red-500">{errors.codePostal.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="ville" className="block text-sm font-medium text-gray-700 mb-1">
              Ville <span className="text-red-500">*</span>
            </label>
            <input
              id="ville"
              type="text"
              disabled={isLoading}
              {...register('ville')}
              className={`w-full p-2 border rounded-md ${errors.ville ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.ville && (
              <p className="mt-1 text-sm text-red-500">{errors.ville.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="pays" className="block text-sm font-medium text-gray-700 mb-1">
            Pays <span className="text-red-500">*</span>
          </label>
          <input
            id="pays"
            type="text"
            disabled={isLoading}
            {...register('pays')}
            className={`w-full p-2 border rounded-md ${errors.pays ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.pays && (
            <p className="mt-1 text-sm text-red-500">{errors.pays.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone <span className="text-red-500">*</span>
          </label>
          <input
            id="telephone"
            type="tel"
            disabled={isLoading}
            {...register('telephone')}
            className={`w-full p-2 border rounded-md ${errors.telephone ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.telephone && (
            <p className="mt-1 text-sm text-red-500">{errors.telephone.message}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            id="isDefault"
            type="checkbox"
            disabled={isLoading}
            {...register('isDefault')}
            className="h-4 w-4 text-lilas-fonce border-gray-300 rounded focus:ring-lilas-fonce"
          />
          <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
            Définir comme adresse par défaut
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors text-sm"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-lilas-fonce text-white rounded-full hover:bg-lilas-fonce/90 transition-colors text-sm flex items-center justify-center min-w-[100px]"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></span>
            ) : (
              isEditing ? 'Mettre à jour' : 'Ajouter'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
} 