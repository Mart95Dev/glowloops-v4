"use client";

import { useState } from 'react';
import { Product } from '@/lib/types/product';
import { HiOutlineShoppingBag, HiOutlineHeart, HiHeart } from 'react-icons/hi';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { Switch } from '@/components/ui/Switch';

interface ProductInfoProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  hasWarrantyExtension: boolean;
  onToggleWarrantyExtension: () => void;
  onAddToCart: () => void;
  stockCount: number;
}

export default function ProductInfo({
  product,
  quantity,
  onQuantityChange,
  hasWarrantyExtension,
  onToggleWarrantyExtension,
  onAddToCart,
  stockCount
}: ProductInfoProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Calcul du prix avec réduction si applicable
  const regularPrice = product.pricing?.regular_price || 0;
  const salePrice = product.pricing?.sale_price || null;
  const finalPrice = salePrice !== null ? salePrice : regularPrice;
  const hasDiscount = salePrice !== null && salePrice < regularPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
    : 0;

  // Prix de l'extension de garantie (fixé à 4.90€)
  const warrantyPrice = 4.90;
  
  // Prix total
  const totalPrice = (finalPrice * quantity) + (hasWarrantyExtension ? warrantyPrice : 0);

  // Formater le prix en euros
  const formatPrice = (price: number) => {
    return price.toFixed(2).replace('.', ',') + ' €';
  };

  // Déterminer si le produit est en stock
  const isInStock = stockCount > 0;
  const isLowStock = stockCount <= 5;

  return (
    <div className="flex flex-col">
      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        {product.isNew && (
          <Badge variant="secondary" className="bg-menthe text-white">
            Nouveau
          </Badge>
        )}
        {hasDiscount && (
          <Badge variant="destructive" className="bg-dore text-white">
            -{discountPercentage}%
          </Badge>
        )}
        {product.shipping?.free_shipping && (
          <Badge variant="outline" className="text-lilas-fonce border-lilas-fonce">
            Livraison gratuite
          </Badge>
        )}
      </div>

      {/* Nom du produit */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
        {product.basic_info?.name}
      </h1>

      {/* Prix */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl md:text-2xl font-bold text-lilas-fonce">
          {formatPrice(finalPrice)}
        </span>
        
        {hasDiscount && (
          <span className="text-sm text-gray-500 line-through">
            {formatPrice(regularPrice)}
          </span>
        )}
      </div>

      {/* Évaluation */}
      <div className="flex items-center mb-4">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg 
              key={i} 
              className={`w-4 h-4 ${i < Math.floor(product.social_proof?.averageRating || 5) ? 'text-yellow-400' : 'text-gray-300'}`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-sm text-gray-500 ml-2">
          ({product.social_proof?.reviewCount || 0} avis)
        </span>
      </div>

      {/* Disponibilité */}
      <div className="mb-6">
        {isInStock ? (
          <div className={`text-sm ${isLowStock ? 'text-amber-600' : 'text-green-600'} font-medium flex items-center`}>
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isLowStock ? 'bg-amber-600' : 'bg-green-600'}`}></span>
            {isLowStock 
              ? `Plus que ${stockCount} en stock !` 
              : 'Prêt à être expédié'}
          </div>
        ) : (
          <div className="text-sm text-red-600 font-medium flex items-center">
            <span className="inline-block w-2 h-2 rounded-full mr-2 bg-red-600"></span>
            Rupture de stock
          </div>
        )}
      </div>

      {/* Description courte */}
      <div className="mb-6">
        <p className="text-gray-600">
          {product.content?.short_description || 'Aucune description disponible.'}
        </p>
      </div>

      {/* Caractéristiques */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-800 mb-2">Caractéristiques :</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          {product.specifications?.materials && (
            <li>Matériaux : {product.specifications.materials.join(', ')}</li>
          )}
          {product.specifications?.metal_type && (
            <li>Type de métal : {product.specifications.metal_type}</li>
          )}
          {product.specifications?.plating && (
            <li>Plaquage : {product.specifications.plating}</li>
          )}
          {product.specifications?.is_nickel_free && (
            <li>Sans nickel</li>
          )}
          {product.specifications?.is_lead_free && (
            <li>Sans plomb</li>
          )}
          {product.specifications?.dimensions_mm && (
            <li>
              Dimensions : 
              {product.specifications.dimensions_mm.height && ` H:${product.specifications.dimensions_mm.height}mm`}
              {product.specifications.dimensions_mm.width && ` L:${product.specifications.dimensions_mm.width}mm`}
              {product.specifications.dimensions_mm.length && ` P:${product.specifications.dimensions_mm.length}mm`}
            </li>
          )}
          {product.specifications?.weight_g && (
            <li>Poids : {product.specifications.weight_g}g</li>
          )}
        </ul>
      </div>

      <Separator className="my-6" />

      {/* Sélecteur de quantité */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-gray-800">Quantité</span>
          <QuantitySelector
            value={quantity}
            onChange={onQuantityChange}
            min={1}
            max={isInStock ? Math.min(stockCount, 10) : 1}
            disabled={!isInStock}
          />
        </div>
      </div>

      {/* Extension de garantie */}
      <div className="mb-6 p-4 bg-lilas-clair/10 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-medium text-gray-800">Extension de garantie</h3>
            <p className="text-sm text-gray-600">Prolongez votre garantie à 2 ans</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-lilas-fonce">+{formatPrice(warrantyPrice)}</span>
            <Switch
              checked={hasWarrantyExtension}
              onCheckedChange={onToggleWarrantyExtension}
            />
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Protégez votre bijou contre les défauts de fabrication pendant 24 mois au lieu des 12 mois de garantie standard.
        </p>
      </div>

      {/* Prix total */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-800">Total</span>
          <span className="text-xl font-bold text-lilas-fonce">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-3 mb-6">
        <Button
          onClick={onAddToCart}
          disabled={!isInStock}
          className="flex-1 bg-lilas-fonce hover:bg-lilas-fonce/90 text-white rounded-full flex items-center justify-center gap-2 py-6"
        >
          <HiOutlineShoppingBag className="h-5 w-5" />
          <span>Ajouter au panier</span>
        </Button>
        
        <Button
          onClick={toggleFavorite}
          variant="outline"
          className="rounded-full border-lilas-fonce text-lilas-fonce hover:bg-lilas-clair/10 w-14 flex items-center justify-center"
        >
          {isFavorite ? (
            <HiHeart className="h-5 w-5 text-red-500" />
          ) : (
            <HiOutlineHeart className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Informations supplémentaires */}
      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex items-start gap-2">
          <svg className="h-5 w-5 text-lilas-fonce flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Livraison sous 2-4 jours ouvrés</span>
        </div>
        <div className="flex items-start gap-2">
          <svg className="h-5 w-5 text-lilas-fonce flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Retours gratuits sous 14 jours</span>
        </div>
        <div className="flex items-start gap-2">
          <svg className="h-5 w-5 text-lilas-fonce flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Garantie 1 an incluse</span>
        </div>
      </div>
    </div>
  );
}
