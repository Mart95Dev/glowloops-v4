import { z } from 'zod';

// Schéma pour l'adresse
export const addressSchema = z.object({
  nom: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  prenom: z.string().min(2, { message: 'Le prénom doit contenir au moins 2 caractères' }),
  adresse: z.string().min(5, { message: 'L\'adresse doit contenir au moins 5 caractères' }),
  complementAdresse: z.string().optional(),
  codePostal: z.string().regex(/^\d{5}$/, { message: 'Le code postal doit contenir 5 chiffres' }),
  ville: z.string().min(2, { message: 'La ville doit contenir au moins 2 caractères' }),
  pays: z.string().min(2, { message: 'Le pays doit contenir au moins 2 caractères' }),
  telephone: z.string().regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, { 
    message: 'Le numéro de téléphone n\'est pas valide' 
  }),
  isDefault: z.boolean().optional().default(false),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

// Schéma pour l'inscription
export const registerSchema = z.object({
  email: z.string().email({ message: 'L\'email n\'est pas valide' }),
  password: z.string().min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    .regex(/[A-Z]/, { message: 'Le mot de passe doit contenir au moins une majuscule' })
    .regex(/[a-z]/, { message: 'Le mot de passe doit contenir au moins une minuscule' })
    .regex(/[0-9]/, { message: 'Le mot de passe doit contenir au moins un chiffre' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

// Schéma pour la connexion
export const loginSchema = z.object({
  email: z.string().email({ message: 'L\'email n\'est pas valide' }),
  password: z.string().min(1, { message: 'Le mot de passe est requis' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// Schéma pour le produit
export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
  images: z.array(z.string()).min(1),
  colors: z.array(z.string()).optional(),
  category: z.string(),
  style: z.string().optional(),
  vibe: z.string().optional(),
  materials: z.array(z.string()).optional(),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  stock: z.number().int().nonnegative(),
  createdAt: z.number(),
  updatedAt: z.number().optional(),
});

export type Product = z.infer<typeof productSchema>;

// Schéma pour le formulaire de contact
export const contactSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(50, "Le nom est trop long"),
  email: z.string().email("Veuillez entrer une adresse email valide"),
  sujet: z.string().min(3, "Le sujet doit contenir au moins 3 caractères").max(100, "Le sujet est trop long"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères").max(1000, "Le message est trop long")
});

export type ContactFormValues = z.infer<typeof contactSchema>;

// Schéma pour la newsletter
export const newsletterSchema = z.object({
  email: z.string().email({ message: 'L\'email n\'est pas valide' }),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;
