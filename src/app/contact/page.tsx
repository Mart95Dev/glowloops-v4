'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { contactSchema, type ContactFormValues } from '@/lib/types/schemas';
import { HiMail, HiPhone, HiLocationMarker, HiStar, HiClock } from 'react-icons/hi';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Une erreur est survenue');
      }

      setSubmitSuccess(true);
      reset();
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-3xl font-bold font-display text-lilas-fonce mb-4">
          💌 Contactez notre équipe de créatrices de boucles d&apos;oreilles
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Besoin d&apos;aide pour sublimer votre style avec nos boucles d&apos;oreilles artisanales ? 
          Notre équipe passionnée vous répond en moins de 24h avec des conseils personnalisés.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Formulaire */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:p-8 order-2 md:order-1">
          {submitSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiMail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Message bien reçu !</h2>
              <p className="text-gray-600 mb-6">
                Merci pour votre message ! Notre équipe créative est déjà en train de préparer une réponse personnalisée pour vous. Vous recevrez notre réponse sous 24h.
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="px-4 py-2 bg-lilas-fonce text-white rounded-md hover:bg-lilas-clair transition-colors"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                  Votre nom
                </label>
                <input
                  type="text"
                  id="nom"
                  {...register('nom')}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-lilas-clair focus:border-lilas-clair"
                  placeholder="Comment pouvons-nous vous appeler ?"
                />
                {errors.nom && (
                  <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Votre email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-lilas-clair focus:border-lilas-clair"
                  placeholder="Pour vous répondre avec nos conseils personnalisés"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="sujet" className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet de votre message
                </label>
                <input
                  type="text"
                  id="sujet"
                  {...register('sujet')}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-lilas-clair focus:border-lilas-clair"
                  placeholder="Ex: Conseil style pour mes créoles dorées #GL1245"
                />
                {errors.sujet && (
                  <p className="text-red-500 text-sm mt-1">{errors.sujet.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Votre message
                </label>
                <textarea
                  id="message"
                  {...register('message')}
                  rows={5}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-lilas-clair focus:border-lilas-clair"
                  placeholder="Dites-nous tout en détail : votre style, occasion, tenue... pour un conseil parfaitement adapté ✨"
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                  isSubmitting ? 'bg-gray-400' : 'bg-lilas-fonce hover:bg-lilas-clair'
                } transition-colors`}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Obtenir votre réponse personnalisée'}
              </button>
              
              <p className="text-xs text-gray-500 text-center">
                Plus de 1500 client·e·s nous contactent chaque mois pour des conseils personnalisés
              </p>
            </form>
          )}
        </div>

        {/* Infos de contact */}
        <div className="order-1 md:order-2">
          <div className="bg-white rounded-xl shadow-md p-6 lg:p-8 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">Comment nous joindre</h2>
            
            <div className="flex items-center mb-4 text-menthe">
              <HiStar className="h-4 w-4 mr-1" />
              <HiStar className="h-4 w-4 mr-1" />
              <HiStar className="h-4 w-4 mr-1" />
              <HiStar className="h-4 w-4 mr-1" />
              <HiStar className="h-4 w-4 mr-1" />
              <span className="text-sm text-gray-600 ml-2">4.8/5 - Service client noté par + de 2400 client·e·s</span>
            </div>
            
            <div className="flex items-center mb-6 text-menthe">
              <HiClock className="h-5 w-5 mr-2" />
              <span className="text-sm text-gray-600">Temps de réponse moyen : 6h</span>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-start">
                <HiMail className="text-lilas-fonce w-5 h-5 mt-1 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-800">Par email (le plus rapide ✨)</h3>
                  <p className="text-gray-600">contact@glowloops.com</p>
                  <p className="text-sm text-gray-500 italic">J&apos;ai reçu une réponse détaillée en 4h avec des photos de styling! - Marie L.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <HiPhone className="text-lilas-fonce w-5 h-5 mt-1 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-800">Par téléphone</h3>
                  <p className="text-gray-600">+33 (0)1 23 45 67 89</p>
                  <p className="text-sm text-gray-500">Du lundi au vendredi, 9h-18h</p>
                  <p className="text-xs text-gray-400">Conseil styling & commandes spéciales disponibles</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <HiLocationMarker className="text-lilas-fonce w-5 h-5 mt-1 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-800">Notre atelier-boutique</h3>
                  <p className="text-gray-600">
                    123 Avenue des Bijoux<br />
                    75001 Paris, France
                  </p>
                  <p className="text-sm text-gray-500">Venez découvrir notre collection complète et rencontrer nos créatrices</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 lg:p-8">
            <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">Besoin d&apos;une réponse immédiate ?</h2>
            <p className="text-gray-600 mb-4">
              Découvrez notre FAQ où nous partageons tous nos secrets sur les matériaux éthiques, l&apos;entretien de vos bijoux et les conseils de style pour sublimer chaque tenue.
            </p>
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <p className="text-sm italic text-gray-600">
                &quot;Grâce aux conseils de la FAQ, mes boucles d&apos;oreilles GlowLoops brillent comme au premier jour après 6 mois d&apos;utilisation quotidienne!&quot; - Sophie M.
              </p>
            </div>
            <Link href="/faq">          
              <button className="w-full py-3 px-4 rounded-md bg-menthe text-black font-medium shadow-md hover:bg-menthe/90 transition-colors">
                Trouvez votre réponse en quelques secondes →
              </button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mt-16 text-center">
        <h2 className="text-xl font-semibold mb-4 text-lilas-fonce">Ils·Elles parlent de nos bijoux et notre service</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-600 italic text-sm">&quot;La conseillère m&apos;a aidée à choisir la paire parfaite pour mon mariage. Service exceptionnel !&quot;</p>
            <p className="font-medium mt-2">Élise T.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-600 italic text-sm">&quot;Réponse en moins de 3h avec des conseils personnalisés pour mon style. Je recommande !&quot;</p>
            <p className="font-medium mt-2">Camille R.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-600 italic text-sm">&quot;J&apos;avais une question sur l&apos;entretien, leur guide détaillé a sauvé mes boucles préférées !&quot;</p>
            <p className="font-medium mt-2">Laura B.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 