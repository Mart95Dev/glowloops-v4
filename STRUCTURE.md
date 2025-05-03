# Structure et Stack Technique de GlowLoops V4

## Stack Technique

Le projet GlowLoops V4 utilise la stack technique suivante qui doit être maintenue pour assurer la cohérence du développement :

| Technologie | Version | Utilisation |
|-------------|---------|-------------|
| Next.js | 14.2.28 | Framework React avec routage App Router |
| TypeScript | ^5 | Typage strict (sans utilisation de "any") |
| Firebase | 11.6.1 | Base de données, authentification, stockage |
| Firebase Admin | 13.3.0 | Accès administrateur à Firebase |
| Zustand | 5.0.3 | Gestion d'état global |
| Tailwind CSS | 3.4.1 | Styling CSS utilitaire |
| Radix UI | ^1.1.x | Composants d'interface accessibles |
| React Hook Form | 7.47.0 | Gestion des formulaires |
| Zod | 3.24.3 | Validation des données et typage |
| Framer Motion | 10.16.4 | Animations |

## Structure du Projet

La structure suivante du projet **DOIT** être strictement respectée :

```
glowloops-v4/
├── .env.local             # Variables d'environnement locales (non versionnées)
├── .gitignore             # Fichiers exclus du versionnement
├── next.config.js         # Configuration Next.js
├── package.json           # Dépendances et scripts
├── postcss.config.mjs     # Configuration PostCSS pour Tailwind
├── tailwind.config.ts     # Configuration Tailwind CSS
├── tsconfig.json          # Configuration TypeScript
│
└── src/                   # Code source de l'application
    ├── app/               # Routes et pages Next.js (App Router)
    │   ├── api/           # Routes API
    │   ├── [routes]/      # Pages de l'application
    │   ├── layout.tsx     # Layout principal
    │   └── page.tsx       # Page d'accueil
    │
    ├── components/        # Composants React réutilisables
    │   ├── ui/            # Composants d'interface génériques
    │   └── [feature]/     # Composants spécifiques aux fonctionnalités
    │
    └── lib/               # Logique métier et utilitaires
        ├── firebase/      # Configuration et services Firebase
        ├── services/      # Services métier
        ├── store/         # Stores Zustand
        ├── types/         # Types et schémas TypeScript/Zod
        └── utils/         # Fonctions utilitaires
```

## Règles de Développement

1. **TypeScript Strict** : Utiliser TypeScript en mode strict et éviter l'utilisation de `any`.
2. **Organisation des Fichiers** : Respecter la structure de dossiers définie ci-dessus.
3. **Gestion d'État** : Utiliser Zustand pour la gestion d'état global.
4. **Validation des Données** : Utiliser Zod pour la validation des données et la définition des schémas.
5. **Composants** : Créer des composants réutilisables et les placer dans le dossier approprié.
6. **Variables d'Environnement** : Stocker les clés API et autres secrets dans des variables d'environnement.
7. **Sécurité** : Ne jamais exposer les clés Firebase ou autres informations sensibles dans le code versionnée.

## Conventions de Nommage

- **Fichiers** : Utiliser le PascalCase pour les composants React (ex: `ProductCard.tsx`) et le kebab-case pour les autres fichiers (ex: `product-service.ts`).
- **Composants** : Nommer les composants en PascalCase (ex: `ProductCard`).
- **Fonctions** : Nommer les fonctions en camelCase (ex: `getProducts`).
- **Types/Interfaces** : Nommer les types et interfaces en PascalCase (ex: `Product`).
- **Stores** : Nommer les stores avec un suffixe "Store" (ex: `productStore`).

Cette structure et ces conventions doivent être strictement respectées pour maintenir la cohérence et la maintenabilité du projet.
