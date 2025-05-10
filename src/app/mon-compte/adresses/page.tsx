'use client';

import { useEffect, useState } from 'react';
import { MapPin, Plus, Pencil, Trash2 } from 'lucide-react';
import { useUserData } from '@/lib/hooks/use-user-data';

interface Address {
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export default function AdressesPage() {
  const { userData, loading, error } = useUserData();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState<number | null>(null);
  
  // Formulaire d'adresse
  const [formData, setFormData] = useState<Address>({
    addressLine1: '',
    addressLine2: null,
    city: '',
    postalCode: '',
    country: 'FR',
    isDefault: false
  });

  useEffect(() => {
    if (userData?.shippingAddresses) {
      setAddresses(userData.shippingAddresses);
    }
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const resetForm = () => {
    setFormData({
      addressLine1: '',
      addressLine2: null,
      city: '',
      postalCode: '',
      country: 'FR',
      isDefault: false
    });
  };

  const handleEditClick = (index: number) => {
    setIsEditingAddress(index);
    setFormData(addresses[index]);
    setIsAddingAddress(false);
  };

  const handleAddClick = () => {
    setIsAddingAddress(true);
    setIsEditingAddress(null);
    resetForm();
  };

  const handleDeleteClick = (index: number) => {
    // Dans une version réelle, nous devrions appeler un service pour mettre à jour dans Firebase
    const newAddresses = [...addresses];
    newAddresses.splice(index, 1);
    setAddresses(newAddresses);
  };

  const handleSetDefaultClick = (index: number) => {
    const newAddresses = addresses.map((address, i) => ({
      ...address,
      isDefault: i === index
    }));
    setAddresses(newAddresses);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditingAddress !== null) {
      // Mode édition
      const newAddresses = [...addresses];
      newAddresses[isEditingAddress] = formData;
      
      // Si cette adresse est définie comme par défaut, mettre à jour les autres
      if (formData.isDefault) {
        newAddresses.forEach((address, index) => {
          if (index !== isEditingAddress) {
            address.isDefault = false;
          }
        });
      }
      
      setAddresses(newAddresses);
      setIsEditingAddress(null);
    } else if (isAddingAddress) {
      // Mode ajout
      const newAddresses = [...addresses];
      
      // Si cette adresse est définie comme par défaut, mettre à jour les autres
      if (formData.isDefault) {
        newAddresses.forEach(address => {
          address.isDefault = false;
        });
      }
      
      newAddresses.push(formData);
      setAddresses(newAddresses);
      setIsAddingAddress(false);
    }
    
    resetForm();
  };

  if (loading) {
    return <div className="py-6 text-center">Chargement des adresses...</div>;
  }

  if (error) {
    return (
      <div className="py-6 text-center text-red-500">
        Erreur lors du chargement des adresses : {error}
      </div>
    );
  }

  return (
    <>
      <h1 className="text-xl md:text-2xl font-playfair text-lilas-fonce mb-6">
        Mes adresses
      </h1>
      
      {/* Liste des adresses */}
      <div className="mb-6 space-y-4">
        {addresses.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <MapPin className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500">Vous n&apos;avez pas encore enregistré d&apos;adresse</p>
          </div>
        ) : (
          addresses.map((address, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${address.isDefault ? 'border-lilas-fonce bg-lilas-clair/10' : 'border-gray-200'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">
                  {address.isDefault && (
                    <span className="text-xs bg-lilas-fonce text-white px-2 py-1 rounded-full mr-2">
                      Par défaut
                    </span>
                  )}
                  Adresse {index + 1}
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditClick(index)}
                    className="text-gray-500 hover:text-lilas-fonce"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(index)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="text-gray-700">
                <p>{address.addressLine1}</p>
                {address.addressLine2 && <p>{address.addressLine2}</p>}
                <p>{address.postalCode} {address.city}</p>
                <p>{address.country === 'FR' ? 'France' : address.country}</p>
              </div>
              
              {!address.isDefault && (
                <button
                  onClick={() => handleSetDefaultClick(index)}
                  className="mt-3 text-sm text-lilas-fonce hover:underline"
                >
                  Définir comme adresse par défaut
                </button>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Bouton Ajouter */}
      {!isAddingAddress && isEditingAddress === null && (
        <button
          onClick={handleAddClick}
          className="mb-6 w-full sm:w-auto flex items-center justify-center gap-2 bg-lilas-fonce hover:bg-lilas-clair text-white py-2 px-4 rounded-full transition-colors"
        >
          <Plus className="h-4 w-4" />
          Ajouter une adresse
        </button>
      )}
      
      {/* Formulaire */}
      {(isAddingAddress || isEditingAddress !== null) && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h2 className="font-playfair text-lg text-lilas-fonce mb-4">
            {isEditingAddress !== null ? 'Modifier l\'adresse' : 'Ajouter une adresse'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse *
              </label>
              <input
                type="text"
                id="addressLine1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">
                Complément d&apos;adresse
              </label>
              <input
                type="text"
                id="addressLine2"
                name="addressLine2"
                value={formData.addressLine2 || ''}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal *
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  Ville *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Pays *
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="FR">France</option>
                <option value="BE">Belgique</option>
                <option value="CH">Suisse</option>
                <option value="LU">Luxembourg</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-lilas-fonce focus:ring-lilas-clair"
              />
              <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                Définir comme adresse par défaut
              </label>
            </div>
            
            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-lilas-fonce hover:bg-lilas-clair text-white py-2 px-4 rounded-md transition-colors"
              >
                {isEditingAddress !== null ? 'Mettre à jour' : 'Ajouter'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setIsAddingAddress(false);
                  setIsEditingAddress(null);
                  resetForm();
                }}
                className="flex-1 border border-gray-300 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-md transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
} 