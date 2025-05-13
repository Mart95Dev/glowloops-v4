'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/firebase/auth';
import { addressService } from '@/lib/services/address-service';
import { useUserStore, UserAddress } from '@/lib/store/user-store';
import { AddressFormValues } from '@/lib/types/schemas';
import AddressList from '@/components/address/AddressList';
import { toast } from 'sonner';

export default function AdressesPage() {
  const { user } = useAuth();
  const { profile, setProfile } = useUserStore();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedAddresses = await addressService.getUserAddresses(user.uid);
      setAddresses(fetchedAddresses);
      
      // Mettre à jour le store Zustand avec les adresses récupérées
      if (profile) {
        setProfile({
          ...profile,
          addresses: fetchedAddresses
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des adresses:", error);
      setError("Impossible de récupérer vos adresses. Veuillez réessayer plus tard.");
    } finally {
      setIsLoading(false);
    }
  }, [user, profile, setProfile]);

  useEffect(() => {
    if (profile) {
      setAddresses(profile.addresses || []);
      setIsLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    if (user && !profile) {
      fetchAddresses();
    }
  }, [user, profile, fetchAddresses]);

  const handleAddAddress = async (addressData: AddressFormValues) => {
    if (!user) return;
    
    try {
      const newAddress = await addressService.addAddress(user.uid, addressData);
      
      // Mettre à jour l'état local
      setAddresses(prev => {
        // Si la nouvelle adresse est par défaut, mettre à jour les autres
        if (addressData.isDefault) {
          return [...prev.map(addr => ({...addr, isDefault: false})), newAddress];
        }
        return [...prev, newAddress];
      });
      
      // Mettre à jour le store Zustand
      if (profile) {
        let updatedAddresses = [...profile.addresses];
        
        if (addressData.isDefault) {
          updatedAddresses = updatedAddresses.map(addr => ({...addr, isDefault: false}));
        }
        
        setProfile({
          ...profile,
          addresses: [...updatedAddresses, newAddress]
        });
      }
      
      toast.success("Adresse ajoutée avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'adresse:", error);
      toast.error("Impossible d'ajouter l'adresse. Veuillez réessayer plus tard.");
      throw error;
    }
  };

  const handleUpdateAddress = async (id: string, addressData: AddressFormValues) => {
    if (!user) return;
    
    try {
      const updatedAddress = {
        id,
        ...addressData
      };
      
      await addressService.updateAddress(user.uid, updatedAddress);
      
      // Mettre à jour l'état local
      setAddresses(prev => {
        const newAddresses = [...prev];
        const index = newAddresses.findIndex(addr => addr.id === id);
        
        if (index !== -1) {
          newAddresses[index] = updatedAddress;
          
          // Si l'adresse est définie comme par défaut, mettre à jour les autres
          if (addressData.isDefault) {
            return newAddresses.map(addr => ({
              ...addr,
              isDefault: addr.id === id
            }));
          }
        }
        
        return newAddresses;
      });
      
      // Mettre à jour le store Zustand
      if (profile) {
        let updatedAddresses = [...profile.addresses];
        const index = updatedAddresses.findIndex(addr => addr.id === id);
        
        if (index !== -1) {
          updatedAddresses[index] = {
            ...updatedAddresses[index],
            ...addressData
          };
          
          // Si l'adresse est définie comme par défaut, mettre à jour les autres
          if (addressData.isDefault) {
            updatedAddresses = updatedAddresses.map(addr => ({
              ...addr,
              isDefault: addr.id === id
            }));
          }
          
          setProfile({
            ...profile,
            addresses: updatedAddresses
          });
        }
      }
      
      toast.success("Adresse mise à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'adresse:", error);
      toast.error("Impossible de mettre à jour l'adresse. Veuillez réessayer plus tard.");
      throw error;
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!user) return;
    
    try {
      await addressService.removeAddress(user.uid, id);
      
      // Mettre à jour l'état local
      setAddresses(prev => {
        const newAddresses = prev.filter(addr => addr.id !== id);
        
        // Si l'adresse supprimée était celle par défaut et qu'il reste des adresses,
        // définir la première comme adresse par défaut
        const wasDefault = prev.find(addr => addr.id === id)?.isDefault || false;
        
        if (wasDefault && newAddresses.length > 0) {
          newAddresses[0].isDefault = true;
        }
        
        return newAddresses;
      });
      
      // Mettre à jour le store Zustand
      if (profile) {
        const wasDefault = profile.addresses.find(addr => addr.id === id)?.isDefault || false;
        const newAddresses = profile.addresses.filter(addr => addr.id !== id);
        
        if (wasDefault && newAddresses.length > 0) {
          newAddresses[0].isDefault = true;
        }
        
        setProfile({
          ...profile,
          addresses: newAddresses
        });
      }
      
      toast.success("Adresse supprimée avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'adresse:", error);
      toast.error("Impossible de supprimer l'adresse. Veuillez réessayer plus tard.");
      throw error;
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    if (!user) return;
    
    try {
      await addressService.setDefaultAddress(user.uid, id);
      
      // Mettre à jour l'état local
      setAddresses(prev => 
        prev.map(addr => ({
          ...addr,
          isDefault: addr.id === id
        }))
      );
      
      // Mettre à jour le store Zustand
      if (profile) {
        setProfile({
          ...profile,
          addresses: profile.addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id
          }))
        });
      }
      
      toast.success("Adresse définie par défaut avec succès");
    } catch (error) {
      console.error("Erreur lors de la définition de l'adresse par défaut:", error);
      toast.error("Impossible de définir l'adresse par défaut. Veuillez réessayer plus tard.");
      throw error;
    }
  };

  if (error) {
    return (
      <div className="py-6 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <AddressList
        addresses={addresses}
        onAddAddress={handleAddAddress}
        onUpdateAddress={handleUpdateAddress}
        onDeleteAddress={handleDeleteAddress}
        onSetDefaultAddress={handleSetDefaultAddress}
        isLoading={isLoading}
      />
    </div>
  );
} 