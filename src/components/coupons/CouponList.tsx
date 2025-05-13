'use client';

import { useEffect } from 'react';
import { useCouponStore } from '@/lib/store/coupon-store';
import { CouponCard } from './CouponCard';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Info } from 'lucide-react';

interface CouponListProps {
  onCopyCode?: (code: string) => void;
}

export const CouponList = ({ onCopyCode }: CouponListProps) => {
  const { coupons, isLoading, error, fetchCoupons } = useCouponStore();

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--lilas-fonce)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-50 border border-gray-200 rounded-md p-6 my-4 text-center"
      >
        <Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <h3 className="text-lg font-medium text-gray-700 mb-1">Aucun bon de réduction</h3>
        <p className="text-sm text-gray-500">
          Vous n&apos;avez pas de bons de réduction disponibles actuellement.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {coupons.map(coupon => (
          <motion.div
            key={coupon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CouponCard coupon={coupon} onCopy={onCopyCode} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}; 