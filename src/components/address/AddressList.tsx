'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MapPin } from 'lucide-react';
import { UserAddress } from '@/lib/store/user-store';
import AddressItem from './AddressItem';
import AddressForm from './AddressForm';
import { AddressFormValues } from '@/lib/types/schemas';

interface AddressListProps {
  addresses: UserAddress[];
  onAddAddress: (address: AddressFormValues) => Promise<void>;
  onUpdateAddress: (id: string, address: AddressFormValues) => Promise<void>;
  onDeleteAddress: (id: string) => Promise<void>;
  onSetDefaultAddress: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export default function AddressList({
  addresses,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
  onSetDefaultAddress,
  isLoading = false
}: AddressListProps) {
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [processingAddressId, setProcessingAddressId] = useState<string | null>(null);

  const handleEdit = (address: UserAddress) => {
    setEditingAddressId(address.id);
    setIsAddingAddress(false);
  };

  const handleDelete = async (id: string) => {
    setProcessingAddressId(id);
    try {
      await onDeleteAddress(id);
    } finally {
      setProcessingAddressId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    setProcessingAddressId(id);
    try {
      await onSetDefaultAddress(id);
    } finally {
      setProcessingAddressId(null);
    }
  };

  const handleAddFormSubmit = async (data: AddressFormValues) => {
    try {
      await onAddAddress(data);
      setIsAddingAddress(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'adresse:", error);
    }
  };

  const handleUpdateFormSubmit = async (data: AddressFormValues) => {
    if (editingAddressId) {
      setProcessingAddressId(editingAddressId);
      try {
        await onUpdateAddress(editingAddressId, data);
        setEditingAddressId(null);
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'adresse:", error);
      } finally {
        setProcessingAddressId(null);
      }
    }
  };

  const handleCancelForm = () => {
    setIsAddingAddress(false);
    setEditingAddressId(null);
  };

  const editingAddress = editingAddressId 
    ? addresses.find(addr => addr.id === editingAddressId) 
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-playfair text-lilas-fonce">
          Mes adresses
        </h2>
        {!isAddingAddress && !editingAddressId && (
          <button
            onClick={() => setIsAddingAddress(true)}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-lilas-fonce hover:bg-lilas-fonce/90 text-white py-2 px-4 rounded-full transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            Ajouter une adresse
          </button>
        )}
      </div>

      <AnimatePresence>
        {isAddingAddress && (
          <AddressForm
            onSubmit={handleAddFormSubmit}
            onCancel={handleCancelForm}
            isLoading={isLoading}
          />
        )}

        {editingAddressId && editingAddress && (
          <AddressForm
            onSubmit={handleUpdateFormSubmit}
            onCancel={handleCancelForm}
            initialValues={editingAddress}
            isLoading={isLoading || processingAddressId === editingAddressId}
            isEditing={true}
          />
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200"
          >
            <MapPin className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500">Vous n&apos;avez pas encore enregistré d&apos;adresse</p>
            {!isAddingAddress && (
              <button
                onClick={() => setIsAddingAddress(true)}
                className="mt-4 text-lilas-fonce hover:underline"
              >
                Ajouter une adresse
              </button>
            )}
          </motion.div>
        ) : (
          <AnimatePresence>
            {addresses.map((address) => (
              <AddressItem
                key={address.id}
                address={address}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
                isLoading={isLoading || processingAddressId === address.id}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
} 