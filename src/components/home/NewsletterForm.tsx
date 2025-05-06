'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Schéma de validation Zod pour le formulaire
const newsletterSchema = z.object({
  email: z.string().email('Veuillez entrer une adresse email valide')
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

interface NewsletterFormProps {
  title: string;
  subtitle: string;
  buttonText: string;
  successMessage: string;
}

export const NewsletterForm = ({
  title,
  subtitle,
  buttonText,
  successMessage
}: NewsletterFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema)
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Simulation d'un appel API pour l'inscription à la newsletter
      // Dans une implémentation réelle, vous appelleriez votre API ici
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Email soumis:', data.email);
      setIsSuccess(true);
      reset();
    } catch (error) {
      console.error('Erreur lors de l\'inscription à la newsletter:', error);
      setErrorMessage('Une erreur est survenue. Veuillez réessayer plus tard.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[var(--creme-nude)] py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-md">
          <div className="mb-6 text-center">
            <h2 className="mb-2 font-playfair text-2xl font-bold">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
          </div>

          {isSuccess ? (
            <div className="rounded-md bg-green-50 p-4 text-center text-green-800">
              <p>{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    placeholder="Votre adresse email"
                    className={`w-full rounded-full border px-4 py-3 pr-12 focus:border-[var(--lilas-fonce)] focus:outline-none ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    {...register('email')}
                    disabled={isSubmitting}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {errorMessage && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-[var(--lilas-fonce)] px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-[var(--lilas-fonce)]/90 disabled:opacity-70"
              >
                {isSubmitting ? 'Inscription en cours...' : buttonText}
              </button>

              <p className="mt-4 text-center text-xs text-gray-500">
                En vous inscrivant, vous acceptez de recevoir nos emails et confirmez avoir lu notre politique de confidentialité.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
