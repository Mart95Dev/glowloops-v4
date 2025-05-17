"use client";

import { useState } from 'react';
import { Product } from '@/lib/types/product';
import { HiOutlineShoppingBag, HiOutlineHeart, HiHeart } from 'react-icons/hi';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/separator';
// import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/Input';
import { AddToCartButton } from './AddToCartButton';
import { FavoriteToggle } from '@/components/account/favorite-toggle';

interface ProductInfoProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  hasGlowCare?: boolean;
  onToggleGlowCare?: () => void;
  onAddToCart: () => void;
  stockCount: number;
}

export default function ProductInfo({
  product,
  quantity,
  onQuantityChange,
  hasGlowCare: propHasGlowCare,
  onToggleGlowCare,
  onAddToCart,
  stockCount
}: ProductInfoProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState('');
  const [localHasGlowCare, setLocalHasGlowCare] = useState(false);
  const [hasExtraInsurance, setHasExtraInsurance] = useState(false);
  const [hasPremiumPackaging, setHasPremiumPackaging] = useState(false);

  // Utiliser soit la prop externe, soit l'état local
  const hasGlowCare = propHasGlowCare !== undefined ? propHasGlowCare : localHasGlowCare;

  // Utiliser le handler externe s'il existe, sinon utiliser le handler local
  const handleGlowCareChange = (checked: boolean) => {
    if (onToggleGlowCare) {
      onToggleGlowCare();
    } else {
      setLocalHasGlowCare(checked);
    }
  };

  // Gestionnaire pour la sélection/désélection de la livraison garantie
  const handleShippingChange = (value: string) => {
    // Si l'option est déjà sélectionnée, on la désélectionne
    if (selectedShipping === value) {
      setSelectedShipping('');
    } else {
      setSelectedShipping(value);
    }
  };

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

  // Prix des options
  const shippingPrices: Record<string, number> = {
    standard: 0,
    express: 0,
    garantie: 2.00 // Prix de la livraison garantie uniquement
  };
  const glowCarePrice = 2.00; // Prix de la protection GlowCare
  const extraInsurancePrice = 1.90;
  const premiumPackagingPrice = 2.90;
  
  // Prix total
  const basePrice = finalPrice * quantity;
  const shippingPrice = shippingPrices[selectedShipping] || shippingPrices.standard;
  const glowCarePriceTotal = hasGlowCare ? glowCarePrice : 0;
  const insurancePrice = hasExtraInsurance ? extraInsurancePrice : 0;
  const packagingPrice = hasPremiumPackaging ? premiumPackagingPrice : 0;
  
  const totalPrice = basePrice + shippingPrice + glowCarePriceTotal + insurancePrice + packagingPrice;

  // Formater le prix en euros
  const formatPrice = (price: number) => {
    return price.toFixed(2).replace('.', ',') + ' €';
  };

  // Déterminer si le produit est en stock
  const isInStock = stockCount > 0;
  const isLowStock = stockCount <= 5;

  return (
    <div className="flex flex-col py-4">
      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        {product.isNew && (
          <Badge variant="menthe">
            Nouveauté
          </Badge>
        )}
        {hasDiscount && (
          <Badge variant="dore">
            -{discountPercentage}%
          </Badge>
        )}
        {product.shipping?.free_shipping && (
          <Badge variant="outline">
            Livraison gratuite
          </Badge>
        )}
        <Badge variant="outline" className="bg-gray-100 border-gray-200 text-gray-700 flex items-center">
          <svg className="w-3 h-3 mr-1 text-lilas-fonce" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>+10 points fidélité</span>
        </Badge>
      </div>

      {/* Nom du produit et Favoris */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
          {product.basic_info?.name}
          <Button
            onClick={toggleFavorite}
            variant="ghost"
            className="ml-2 rounded-full hover:bg-lilas-clair/10 p-1 h-auto transition-all duration-300 hover:scale-110"
          >
            {isFavorite ? (
              <HiHeart className="h-8 w-8 text-red-500" />
            ) : (
              <HiOutlineHeart className="h-8 w-8 text-lilas-fonce" />
            )}
          </Button>
        </h1>
      </div>

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
          ({product.social_proof?.reviewCount || 0} avis client·e·s)
        </span>
      </div>

      {/* Disponibilité */}
      <div className="mb-6">
        {isInStock ? (
          <div className={`text-sm ${isLowStock ? 'text-amber-600' : 'text-green-600'} font-medium flex items-center`}>
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isLowStock ? 'bg-amber-600' : 'bg-green-600'}`}></span>
            {isLowStock 
              ? `Dernière chance ! Plus que ${stockCount} en stock ✨` 
              : 'Prêt à être expédié aujourd\'hui - Livraison express disponible'}
          </div>
        ) : (
          <div className="text-sm text-red-600 font-medium flex items-center">
            <span className="inline-block w-2 h-2 rounded-full mr-2 bg-red-600"></span>
            Rupture temporaire - Recevez une alerte dès le retour en stock
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
        <h3 className="font-medium text-gray-800 mb-2">Pourquoi vous allez l&apos;adorer :</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          {product.specifications?.materials && (
            <li>Matériaux premium sélectionnés pour sublimer votre teint et garantir un confort toute la journée</li>
          )}
          {product.specifications?.metal_type && (
            <li>Métal {product.specifications.metal_type} pour un éclat durable qui attire tous les regards</li>
          )}
          {product.specifications?.plating && (
            <li>Plaquage {product.specifications.plating} qui préserve sa brillance même après plusieurs mois d&apos;utilisation</li>
          )}
          {product.specifications?.is_nickel_free && (
            <li>Formule sans nickel idéale pour les peaux sensibles - Confort garanti</li>
          )}
          {product.specifications?.is_lead_free && (
            <li>Sans plomb - Portez vos bijoux en toute sécurité avec notre engagement qualité</li>
          )}
          {product.specifications?.dimensions_mm && (
            <li>
              Dimensions parfaites pour un look équilibré qui met en valeur votre visage
            </li>
          )}
          {product.specifications?.weight_g && (
            <li>Ultra légères ({product.specifications.weight_g}g) - Vous oublierez que vous les portez !</li>
          )}
        </ul>
      </div>

      <Separator className="my-6" />

      {/* Extension de garantie - section améliorée et indépendante */}
      <div className="mb-6 p-4 bg-gradient-to-r from-lilas-clair/20 to-lilas-fonce/10 rounded-lg border border-lilas-clair shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-lilas-clair/20 rounded-full -mr-12 -mt-12 z-0"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-menthe/10 rounded-full -ml-8 -mb-8 z-0"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 flex items-center">
                <span className="mr-2">Protection GlowCare+</span>
                <Badge variant="success" className="animate-pulse">
                  94% recommandent
                </Badge>
              </h3>
              <p className="text-sm text-gray-600 mt-1">Profitez de votre bijou l&apos;esprit tranquille</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-lilas-fonce">+{formatPrice(glowCarePrice)}</span>
              <Switch
                checked={hasGlowCare}
                onCheckedChange={handleGlowCareChange}
                className="data-[state=checked]:bg-green-600"
              />
            </div>
          </div>
          
          <div className="text-xs text-gray-600 space-y-2">
            <p className="font-medium">Avec GlowCare+, vous bénéficiez de :</p>
            <div className="flex items-start gap-2">
              <svg className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Garantie étendue à 6 mois (triple protection)</span>
            </div>
            <div className="flex items-start gap-2">
              <svg className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Remplacement sans questions en cas d&apos;accident</span>
            </div>
            <div className="flex items-start gap-2">
              <svg className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Service VIP avec traitement prioritaire</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Prix total */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-800">Total</span>
          <span className="text-xl font-bold text-lilas-fonce">{formatPrice(totalPrice)}</span>
        </div>
        <div className="mt-1 text-xs text-lilas-fonce flex items-center justify-end">
          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Vous gagnez {Math.round(finalPrice / 2)} points fidélité</span>
        </div>
      </div>
      
      {/* Options de livraison - DÉPLACÉ AVANT LE BOUTON */}
      <div className="mb-6">
        <h3 className="font-medium text-base md:text-lg text-gray-800 mb-4">Options de livraison et services</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          
          
          <div className="flex items-start gap-2">
            <input 
              type="checkbox" 
              className="mt-1 accent-lilas-fonce appearance-none w-4 h-4 border border-lilas-fonce checked:bg-lilas-fonce checked:border-lilas-fonce focus:outline-none" 
              name="livraison" 
              id="livraison-garantie" 
              checked={selectedShipping === 'garantie'}
              onChange={() => handleShippingChange('garantie')}
            />
            <label htmlFor="livraison-garantie" className="w-full">
              <div className="font-medium flex items-center">
                <span>Livraison express garantie</span>
                <Badge className="ml-2" variant="default">Populaire</Badge>
              </div>
              <div className="text-gray-600 text-sm flex items-center">
                <Badge className="mr-2 whitespace-nowrap" variant="secondary">+2,00 €</Badge>
                <span>Livraison sous 48h avec suivi premium</span>
              </div>
            </label>
          </div>
          
          <div className="flex items-start gap-2">
            <input 
              type="checkbox" 
              className="mt-1 accent-lilas-fonce appearance-none w-4 h-4 border border-lilas-fonce checked:bg-lilas-fonce checked:border-lilas-fonce focus:outline-none" 
              name="assurance" 
              id="assurance-perte"
              checked={hasExtraInsurance}
              onChange={() => setHasExtraInsurance(!hasExtraInsurance)}
            />
            <label htmlFor="assurance-perte" className="w-full">
              <div className="font-medium flex items-center">
                <span>Protection perte & vol</span>
                <Badge className="ml-2" variant="menthe">Tranquillité</Badge>
              </div>
              <div className="text-gray-600 text-sm flex items-center flex-wrap sm:flex-nowrap">
                <Badge className="mr-2 whitespace-nowrap" variant="secondary">+0,90 €</Badge>
                <span>Remplacement à l&apos;identique en cas de problème</span>
              </div>
            </label>
          </div>
          
          <div className="flex items-start gap-2 md:col-span-2 mt-2 bg-lilas-clair/5 p-3 rounded-lg">
            <input 
              type="checkbox" 
              className="mt-1 accent-lilas-fonce appearance-none w-4 h-4 border border-lilas-fonce checked:bg-lilas-fonce checked:border-lilas-fonce focus:outline-none" 
              name="emballage" 
              id="emballage-premium"
              checked={hasPremiumPackaging}
              onChange={() => setHasPremiumPackaging(!hasPremiumPackaging)}
            />
            <label htmlFor="emballage-premium" className="w-full">
              <div className="font-medium flex items-center">
                <span>Écrin cadeau luxe</span>
                <Badge className="ml-2" variant="dore">Parfait pour offrir</Badge>
              </div>
              <div className="text-gray-600 text-sm flex items-center flex-wrap sm:flex-nowrap">
                <Badge className="mr-2 whitespace-nowrap" variant="secondary">+2,90 €</Badge>
                <span>Packaging luxueux qui impressionnera dès l&apos;ouverture</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Boutons d'action avec sélecteur de quantité sur la même ligne */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 mt-8 relative">
        <div className="w-full max-w-[600px] bg-lilas-clair/10 rounded-2xl p-4 sm:p-6 shadow-lg border border-lilas-clair/30 animate-pulse-gentle">
          <div className="flex items-center justify-center gap-3">
            {/* Sélecteur de quantité */}
            <div className="flex items-center min-w-[120px] w-[30%] bg-white rounded-none overflow-hidden shadow-sm">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                disabled={!isInStock || quantity <= 1}
                className="h-10 w-10 rounded-sm flex-shrink-0 hover:bg-lilas-clair/10 border-2 border-lilas-fonce shadow-sm active:shadow-inner active:translate-y-[1px] active:bg-lilas-clair/20 transition-all"
              >
                <span className="text-black font-bold">-</span>
              </Button>
              <div className="w-12 px-1 flex-grow">
                <Input 
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 1 && value <= (isInStock ? Math.min(stockCount, 10) : 1)) {
                      onQuantityChange(value);
                    }
                  }}
                  className="text-center h-10 px-0 font-semibold border-0 focus:ring-0 focus-visible:ring-0"
                  disabled={!isInStock}
                  min={1}
                  max={isInStock ? Math.min(stockCount, 10) : 1}
                />
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => onQuantityChange(Math.min(isInStock ? stockCount : 1, Math.min(quantity + 1, 10)))}
                disabled={!isInStock || quantity >= Math.min(stockCount, 10)}
                className="h-10 w-10 rounded-sm flex-shrink-0 hover:bg-lilas-clair/10 border-2 border-lilas-fonce shadow-sm active:shadow-inner active:translate-y-[1px] active:bg-lilas-clair/20 transition-all"
              >
                <span className="text-black font-bold">+</span>
              </Button>
            </div>

            {/* Bouton d'action */}
            <Button
              onClick={onAddToCart}
              disabled={!isInStock}
              className="flex-grow max-w-[400px] min-w-[200px] w-[70%] bg-lilas-fonce hover:bg-lilas-fonce/90 text-white rounded-full flex items-center justify-center gap-2 py-6 transition-all duration-300 hover:scale-[1.03] shadow-md hover:shadow-xl"
            >
              <HiOutlineShoppingBag className="h-6 w-6" />
              <span className="font-semibold text-base">{isLowStock ? "Ajoutez vite au panier" : "Ajoutez à votre style"}</span>
            </Button>
          </div>
          
          {/* Indicateur de stock */}
          {isInStock && isLowStock && (
            <div className="mt-2 text-xs text-center text-amber-600">
              Plus que {stockCount} en stock ! Les autres client·e·s sont en train d&apos;acheter
            </div>
          )}
        </div>
        
        <style jsx global>{`
          @keyframes pulse-gentle {
            0% {
              box-shadow: 0 0 0 0 rgba(176, 162, 212, 0.4);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(176, 162, 212, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(176, 162, 212, 0);
            }
          }
          .animate-pulse-gentle {
            animation: pulse-gentle 2s infinite;
          }
          
          /* Styles personnalisés pour les cases à cocher */
          input[type="checkbox"]:checked, input[type="radio"]:checked {
            background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;
          }
        `}</style>
      </div>

      {/* Informations supplémentaires - RÉORGANISÉ EN COLONNES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
        <div className="flex items-start gap-2">
          <svg className="h-5 w-5 text-lilas-fonce flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Livraison rapide en 2-4 jours ouvré avec suivi</span>
        </div>
        <div className="flex items-start gap-2">
          <svg className="h-5 w-5 text-lilas-fonce flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Retours gratuits & simplifiés sous 14 jours</span>
        </div>
        <div className="flex items-start gap-2">
          <svg className="h-5 w-5 text-lilas-fonce flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Garantie 1 an incluse - Profitez l&apos;esprit libre</span>
        </div>
        <div className="flex items-start gap-2">
          <svg className="h-5 w-5 text-lilas-fonce flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Paiement sécurisé & crypté à 100%</span>
        </div>
      </div>

      {/* Dans la section des boutons d'action, après le bouton AddToCartButton */}
      <div className="flex flex-wrap gap-3 mt-6">
        <AddToCartButton 
          productId={product.id}
          name={product.basic_info.name}
          price={finalPrice}
          image={product.media?.mainImageUrl || ''}
          selectedVariant={selectedShipping}
          quantity={quantity}
          setQuantity={onQuantityChange}
        />
        
        <FavoriteToggle
          productId={product.id}
          productName={product.basic_info.name}
          productPrice={finalPrice}
          productImage={product.media?.mainImageUrl || ''}
          size="md"
          displayStyle="button" 
          color="lilas"
        />
      </div>
    </div>
  );
}
