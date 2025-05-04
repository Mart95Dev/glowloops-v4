"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

interface ScrollTopButtonProps {
  show: boolean;
  onClick: () => void;
}

const ScrollTopButton: React.FC<ScrollTopButtonProps> = ({ show, onClick }) => {
  return (
    <motion.button
      className="fixed bottom-4 right-4 md:bottom-8 md:right-8 p-3 bg-lilas rounded-full border-lilas-fonce border-2 shadow-lg z-50"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: show ? 1 : 0, 
        scale: show ? 1 : 0.5,
        y: show ? 0 : 20
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.3 }}
      aria-label="Retour en haut de la page"
    >
      <ArrowUp className="w-5 h-5" aria-hidden="true" />
    </motion.button>
  );
};

export default ScrollTopButton;
