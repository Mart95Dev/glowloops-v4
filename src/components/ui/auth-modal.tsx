import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export const AuthModal = ({ 
  isOpen, 
  onClose,
  message = "Connectez-vous pour accéder à cette fonctionnalité"
}: AuthModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-md w-full shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Connexion requise</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>

          <div className="space-y-3">
            <Link 
              href="/auth/connexion"
              className="block w-full bg-lilas-fonce hover:bg-lilas-clair text-white py-2 px-4 rounded-full text-center transition-colors"
            >
              Se connecter
            </Link>
            <Link 
              href="/auth/inscription"
              className="block w-full border border-lilas-fonce text-lilas-fonce hover:bg-lilas-fonce/10 py-2 px-4 rounded-full text-center transition-colors"
            >
              Créer un compte
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal; 