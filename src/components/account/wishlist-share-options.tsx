'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share, Link, Mail, X, Smartphone } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { toast } from '@/lib/utils/toast';
import QRCode from 'react-qr-code';

interface WishlistShareOptionsProps {
  url: string;
  title: string;
  onClose: () => void;
}

export function WishlistShareOptions({ url, title, onClose }: WishlistShareOptionsProps) {
  const [showQR, setShowQR] = useState(false);
  
  const shareOptions = [
    {
      name: 'Facebook',
      icon: <FaFacebook className="h-5 w-5" />,
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank'
        );
      }
    },
    {
      name: 'Instagram',
      icon: <FaInstagram className="h-5 w-5" />,
      action: () => {
        copyToClipboard();
        toast.success('Lien copié ! Partagez-le sur Instagram');
      }
    },
    {
      name: 'Twitter',
      icon: <FaTwitter className="h-5 w-5" />,
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
          '_blank'
        );
      }
    },
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp className="h-5 w-5" />,
      action: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
          '_blank'
        );
      }
    },
    {
      name: 'Email',
      icon: <Mail className="h-5 w-5" />,
      action: () => {
        window.open(
          `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Découvre ma wishlist GlowLoops : ${url}`)}`,
          '_blank'
        );
      }
    },
    {
      name: 'QR Code',
      icon: <Smartphone className="h-5 w-5" />,
      action: () => setShowQR(!showQR)
    }
  ];
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast.success('Lien copié dans le presse-papiers');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-5 rounded-lg shadow-sm border"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Partager ma wishlist</h2>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center">
          <input
            type="text"
            value={url}
            readOnly
            className="flex-1 px-3 py-2 border rounded-l-md bg-gray-50 text-gray-700"
          />
          <button
            onClick={copyToClipboard}
            className="bg-lilas-fonce text-white px-3 py-2 rounded-r-md hover:bg-lilas-clair transition-colors"
            aria-label="Copier le lien"
          >
            <Link className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {shareOptions.map((option) => (
          <button
            key={option.name}
            onClick={option.action}
            className="flex flex-col items-center justify-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            aria-label={`Partager sur ${option.name}`}
          >
            {option.icon}
            <span className="text-xs mt-2">{option.name}</span>
          </button>
        ))}
      </div>
      
      {showQR && (
        <div className="mt-6 p-4 border rounded-lg bg-white">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">QR Code</h3>
            <button
              onClick={() => setShowQR(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Fermer le QR code"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex justify-center p-4 bg-white">
            <QRCode value={url} size={200} />
          </div>
          
          <p className="text-center text-sm text-gray-500 mt-2">
            Scannez ce code pour accéder à la wishlist
          </p>
        </div>
      )}
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
        >
          <Share className="h-4 w-4" />
          <span>Terminé</span>
        </button>
      </div>
    </motion.div>
  );
} 