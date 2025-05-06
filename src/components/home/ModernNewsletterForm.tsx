"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { HiOutlineMail, HiCheck } from 'react-icons/hi';

interface ModernNewsletterFormProps {
  title: string;
  subtitle: string;
  buttonText: string;
  successMessage: string;
}

export default function ModernNewsletterForm({
  title,
  subtitle,
  buttonText,
  successMessage,
}: ModernNewsletterFormProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Veuillez entrer votre adresse email');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    setIsLoading(true);

    try {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
      setEmail('');
    } catch {
      // Nous capturons l'erreur sans la stocker dans une variable
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section 
      ref={ref} 
      className="min-w-[375px] py-16 px-4 bg-gradient-to-r from-lilas-fonce/90 to-lilas-clair/90"
    >
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <motion.div 
              className="bg-gradient-to-br from-lilas-clair to-lilas-fonce p-8 md:p-12 flex flex-col justify-center text-white"
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6">
                <span className="inline-block w-12 h-1 bg-menthe mb-4"></span>
                <h2 className="text-2xl md:text-3xl font-bold font-display mb-3">
                  {title}
                </h2>
                <p className="text-white/80">
                  {subtitle}
                </p>
              </div>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-center">
                  <HiCheck className="h-5 w-5 text-menthe mr-2" />
                  <span>Accès en avant-première aux nouveautés</span>
                </li>
                <li className="flex items-center">
                  <HiCheck className="h-5 w-5 text-menthe mr-2" />
                  <span>Offres exclusives réservées aux abonnées</span>
                </li>
                <li className="flex items-center">
                  <HiCheck className="h-5 w-5 text-menthe mr-2" />
                  <span>Conseils style et inspiration bijoux</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="p-8 md:p-12 flex flex-col justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.6 }}
            >
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <HiCheck className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Merci de votre inscription !</h3>
                  <p className="text-gray-600">
                    {successMessage}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Rejoignez notre communauté
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Inscrivez-vous pour recevoir nos dernières nouveautés et offres exclusives.
                  </p>
                  
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <HiOutlineMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Votre adresse email"
                      className={`w-full pl-10 pr-4 py-3 border ${
                        error ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-lilas-clair focus:border-lilas-clair outline-none transition-all duration-300`}
                    />
                  </div>
                  
                  {error && (
                    <p className="text-red-500 text-xs">{error}</p>
                  )}
                  
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg bg-dore hover:bg-dore/90 text-white py-3 transition-all duration-300"
                  >
                    {isLoading ? 'Inscription en cours...' : buttonText}
                  </Button>
                  
                  <p className="text-xs text-gray-500 mt-4">
                    En vous inscrivant, vous acceptez de recevoir nos emails marketing et confirmez avoir lu notre politique de confidentialité.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
