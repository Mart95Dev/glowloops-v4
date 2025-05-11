'use client';

import { useState } from 'react';
import { MapPin, Pencil, Trash2 } from 'lucide-react';
import { UserAddress } from '@/lib/store/user-store';
import { motion } from 'framer-motion';

interface AddressItemProps {
  address: UserAddress;
  onEdit: (address: UserAddress) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  isLoading?: boolean;
}

export default function AddressItem({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isLoading = false
}: AddressItemProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleDeleteClick = () => {
    if (isConfirmingDelete) {
      onDelete(address.id);
      setIsConfirmingDelete(false);
    } else {
      setIsConfirmingDelete(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className={`p-4 rounded-lg border ${
        address.isDefault ? 'border-lilas-fonce bg-lilas-clair/10' : 'border-gray-200'
      } relative`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="font-medium flex items-center">
          {address.isDefault && (
            <span className="text-xs bg-lilas-fonce text-white px-2 py-1 rounded-full mr-2">
              Par défaut
            </span>
          )}
          <span>{address.prenom} {address.nom}</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(address)}
            disabled={isLoading}
            className="text-gray-500 hover:text-lilas-fonce transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Modifier l'adresse"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={handleDeleteClick}
            disabled={isLoading}
            className={`text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full ${
              isConfirmingDelete ? 'bg-red-100 text-red-500' : 'hover:bg-gray-100'
            }`}
            aria-label={isConfirmingDelete ? "Confirmer la suppression" : "Supprimer l'adresse"}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="text-gray-700 flex items-start">
        <MapPin className="h-4 w-4 mr-2 mt-1 text-gray-400" />
        <div>
          <p>{address.adresse}</p>
          {address.complementAdresse && <p>{address.complementAdresse}</p>}
          <p>{address.codePostal} {address.ville}</p>
          <p>{address.pays}</p>
          <p className="text-sm text-gray-500 mt-1">{address.telephone}</p>
        </div>
      </div>

      {!address.isDefault && (
        <button
          onClick={() => onSetDefault(address.id)}
          disabled={isLoading}
          className="mt-3 text-sm text-lilas-fonce hover:underline flex items-center transition-colors"
        >
          <MapPin className="h-3 w-3 mr-1" />
          Définir comme adresse par défaut
        </button>
      )}

      {isConfirmingDelete && (
        <div className="mt-2 text-sm text-red-500">
          <p>Confirmer la suppression ?</p>
          <div className="flex gap-2 mt-1">
            <button 
              onClick={handleDeleteClick}
              className="px-2 py-1 bg-red-500 text-white rounded text-xs"
            >
              Confirmer
            </button>
            <button 
              onClick={() => setIsConfirmingDelete(false)}
              className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
          <div className="w-5 h-5 border-2 border-lilas-fonce border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </motion.div>
  );
} 