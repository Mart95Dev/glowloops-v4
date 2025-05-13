'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Coupon } from '@/lib/types/coupon';
import { formatDate } from '@/lib/utils/date-utils';
import { ClipboardCopy, Check, AlertCircle } from 'lucide-react';

interface CouponCardProps {
  coupon: Coupon;
  onCopy?: (code: string) => void;
}

export const CouponCard = ({ coupon, onCopy }: CouponCardProps) => {
  const [copied, setCopied] = useState(false);
  const isExpiringSoon = coupon.expiryDate && coupon.expiryDate.getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000; // 7 jours
  
  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    if (onCopy) onCopy(coupon.code);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white rounded-lg shadow-md overflow-hidden"
    >
      {/* Barre supérieure colorée */}
      <div className="w-full h-2 bg-[var(--lilas-clair)]" />
      
      <div className="p-4">
        {/* En-tête du bon */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800">{coupon.description}</h3>
          {isExpiringSoon && (
            <div className="flex items-center gap-1 text-amber-600 text-sm">
              <AlertCircle size={16} />
              <span>Expire bientôt</span>
            </div>
          )}
        </div>
        
        {/* Valeur du bon */}
        <div className="mb-4 text-xl font-bold text-[var(--lilas-fonce)]">
          {coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value}€`} de réduction
        </div>
        
        {/* Code du bon avec bouton de copie */}
        <div 
          className="flex items-center justify-between bg-gray-100 rounded-md p-2 mb-3 cursor-pointer"
          onClick={handleCopy}
        >
          <span className="font-mono text-gray-700">{coupon.code}</span>
          <button className="p-1 rounded-full hover:bg-gray-200">
            {copied ? <Check size={18} className="text-green-600" /> : <ClipboardCopy size={18} />}
          </button>
        </div>
        
        {/* Détails et conditions */}
        <div className="text-sm text-gray-600 space-y-1 mb-3">
          {coupon.minPurchase && (
            <p>Achat minimum: {coupon.minPurchase}€</p>
          )}
          {coupon.conditions && (
            <p>{coupon.conditions}</p>
          )}
          <p>Valable jusqu&apos;au {formatDate(coupon.expiryDate)}</p>
        </div>
      </div>
    </motion.div>
  );
}; 