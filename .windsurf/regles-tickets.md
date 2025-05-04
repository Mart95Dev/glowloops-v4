# Règles pour Cursor AI - Gestion des Tickets GlowLoops

## Principes fondamentaux

En tant qu'outil d'assistance, Cursor AI doit suivre ces règles lorsqu'on lui demande de travailler sur un ticket GlowLoops :

1. Ne travailler que sur un seul ticket à la fois
2. Travailler uniquement sur le ticket spécifiquement demandé (par ex: "Fais le ticket GLOW-001")
3. Ne pas suggérer de travailler sur d'autres tickets, sauf si demandé explicitement
4. Respecter les détails de chaque ticket et implémenter uniquement les fonctionnalités qui y sont décrites
5. Indiquer clairement quand un ticket est terminé
6. Présenter le code de manière organisée, avec des commentaires appropriés 
7. ne pas creer de mock en fichier ou dans le code en dur.
8. toutes les données sont dans firestore et storage sont récupérées via les fonctions de base.
9. les images sont dans storage et sont récupérées via les fonctions de base.
10. utiliser les composants shadcn pour la simplicité sauf si la création de composant personnalisés est plus adapté à la situation.
11. installer les composant shadcn manquants via le terminal si c'est necessaire.

## Workflow de développement des tickets

1. **Analyse** : Comprendre l'objectif et les critères d'acceptation du ticket
2. **Planification** : Identifier les fichiers à créer ou modifier
3. **Développement** : Implémenter les fonctionnalités requises
4. **Tests** : S'assurer que le code fonctionne comme prévu
5. **Documentation** : Ajouter des commentaires et documenter l'utilisation
6. **Validation** : Vérifier que tous les critères d'acceptation sont remplis

## Priorités des tickets

- **Très élevée** : Fonctionnalités critiques pour le lancement (ex: tunnel de commande)
- **Élevée** : Fonctionnalités essentielles pour l'expérience utilisateur
- **Moyenne** : Fonctionnalités importantes mais non bloquantes
- **Basse** : Améliorations et optimisations

## Estimation des points

L'estimation en points reflète la complexité et l'effort requis :
- **1-3 points** : Tâche simple, quelques heures de travail
- **5-8 points** : Tâche moyenne, 1-2 jours de travail
- **13+ points** : Tâche complexe, plusieurs jours de travail

## Suivi des tickets

Pour chaque ticket complété, fournir :
- Un résumé des fonctionnalités implémentées
- Les fichiers créés ou modifiés
- Les tests effectués
- Les éventuels problèmes rencontrés et leurs solutions

## Liste des tickets

### GLOW-001: Mise en place de l'architecture de base et système de design
**Priorité**: Élevée
**Estimation**: 3 points
**Description**:
Configurer l'architecture de base du projet Next.js 15 avec Zustand pour la gestion d'état, Zod pour la validation des formulaires et TailwindCSS 4 pour le styling.

**Tâches**:

- Configurer Zustand avec les stores principaux (panier, utilisateur, UI)
- Mettre en place Zod pour la validation des schémas de données
- Configurer TailwindCSS  avec les couleurs personnalisées de GlowLoops
- Créer les variables CSS pour les couleurs de base (lilas-clair, lilas-fonce, creme-nude, dore, menthe)
- Configurer les polices Playfair Display et Poppins

**Critères d'acceptation**:- Le projet démarre sans erreur avec npm run dev
- Les stores Zustand sont correctement configurés
- Les couleurs et la typographie sont conformes à la charte graphique
- La connexion à Firebase est fonctionnelle

### GLOW-002: Composants UI réutilisables
**Priorité**: Élevée
**Estimation**: 5 points
**Description**:
Développer les composants UI réutilisables qui serviront de base à l'ensemble du site.

**Tâches**:
- Créer le composant Button avec ses variantes (default, secondary, outline)
- Développer les composants de formulaire (Input, Select, Checkbox, Radio, etc.)
- Créer le composant Card pour l'affichage des produits
- Développer un système de notifications/toasts
- Créer les composants de navigation (Breadcrumbs, Pagination, Tabs)
- Implémenter les composants d'affichage (Badge, Tooltip, Modal)

**Critères d'acceptation**:
- Tous les composants sont responsives
- Les composants suivent la charte graphique GlowLoops
- Les états (hover, focus, disabled) sont implémentés
- Les composants sont accessibles (a11y)
- Documentation minimale avec des exemples d'utilisation

### GLOW-003: Layout principal et navigation
**Priorité**: Élevée
**Estimation**: 5 points
**Description**:
Développer le layout principal incluant header, footer et navigation mobile.

**Tâches**:
- Créer le composant Header avec logo, recherche, menu utilisateur et panier
- Implémenter la navigation principale avec sous-catégories
- Développer le Footer avec les différentes sections
- Créer la navigation mobile avec menu burger et animations
- Intégrer la bannière promotionnelle avec compte à rebours
- Implémenter le système de recherche avec suggestions depuis Firestore

**Critères d'acceptation**:
- Navigation fluide entre les différentes pages
- Menu mobile fonctionnel avec animations
- Barre de recherche fonctionnelle avec suggestions
- Interface responsive sur tous les appareils
- État authentifié/non-authentifié correctement géré

### GLOW-004: Page d'accueil
**Priorité**: Élevée
**Estimation**: 8 points
**Description**:
Développer la page d'accueil avec toutes les sections principales.

**Tâches**:
- Créer le Hero Banner avec image et texte
- Implémenter la grille des collections avec animations
- Développer le slider des nouveautés
- Créer la section "Nos clientes adorent GlowLoops" avec images Instagram
- Implémenter la section best-sellers
- Développer la FAQ rapide avec accordéon
- Créer la bannière d'avantages (livraison, qualité, retours)
- Intégrer le formulaire de newsletter

**Critères d'acceptation**:
- Toutes les sections sont responsives
- Les animations sont fluides
- Les données sont chargées depuis Firestore
- Le formulaire de newsletter est fonctionnel
- Les performances sont optimisées (Core Web Vitals)

### GLOW-005: Page boutique et filtrage des produits
**Priorité**: Élevée
**Estimation**: 8 points
**Description**:
Développer la page boutique avec système de filtrage, tri et pagination.

**Tâches**:
- Créer l'UI de la page boutique avec filtres latéraux
- Implémenter la grille de produits avec mode liste/grille
- Développer les filtres par Style, Vibe, Matériaux, Prix
- Créer le système de tri (Nouveautés, Prix, Popularité)
- Implémenter la pagination ou le chargement infini
- Créer les filtres mobiles avec drawer
- Persister les filtres dans l'URL

**Critères d'acceptation**:
- Les filtres fonctionnent correctement avec la base Firestore
- La pagination/chargement infini fonctionne parfaitement
- Les filtres sont persistés dans l'URL pour le partage
- L'interface est responsive
- Le système de filtrage est optimisé pour éviter des requêtes inutiles

### GLOW-006: Page produit détaillée
**Priorité**: Élevée
**Estimation**: 8 points
**Description**:
Développer la page produit avec galerie, informations et options d'achat.

**Tâches**:
- Créer la galerie d'images avec zoom et navigation
- Implémenter les informations produit (nom, prix, description)
- Développer le sélecteur de quantité
- Créer le système d'option de couleur
- Implémenter l'option d'extension de garantie
- Développer la section de produits complémentaires
- Créer les onglets (Description, Avis clients, Livraison)
- Intégrer les boutons d'action (Ajouter au panier, Favoris)

**Critères d'acceptation**:
- La galerie fonctionne parfaitement sur tous les appareils
- L'ajout au panier met à jour le store Zustand
- Les produits complémentaires sont correctement affichés
- Les avis clients sont chargés depuis Firestore
- Les animations sont fluides

### GLOW-007: Système de panier
**Priorité**: Élevée
**Estimation**: 8 points
**Description**:
Développer le système de panier complet.

**Tâches**:
- Créer le store Zustand pour la gestion du panier
- Développer le dropdown du panier dans le header
- Créer la page panier complète
- Implémenter la modification des quantités
- Développer le calcul du total, sous-total et frais de livraison
- Créer l'upsell après ajout au panier
- Implémenter la sauvegarde du panier dans localStorage
- Synchroniser le panier avec Firestore pour les utilisateurs connectés

**Critères d'acceptation**:
- Le panier se met à jour en temps réel
- Les opérations (ajout, suppression, modification) fonctionnent
- Le panier est persistant (localStorage)
- La synchronisation avec Firestore fonctionne
- L'interface est responsive

### GLOW-008: Tunnel de commande
**Priorité**: Très élevée
**Estimation**: 13 points
**Description**:
Développer le processus complet de checkout en plusieurs étapes.

**Tâches**:
- Créer le stepper pour suivre les étapes du checkout
- Développer le formulaire d'adresse avec validation Zod
- Implémenter les options de livraison
- Créer l'intégration avec le système de paiement
- Développer la page de confirmation de commande
- Implémenter les offres post-achat (upsell)
- Créer le système de code promo
- Développer la sauvegarde des informations de commande dans Firestore

**Critères d'acceptation**:
- Le parcours de checkout est fluide et sans erreur
- La validation des formulaires fonctionne correctement
- Les informations sont correctement enregistrées dans Firestore
- L'interface est responsive
- Les offres post-achat fonctionnent

### GLOW-009: Système d'authentification
**Priorité**: Élevée
**Estimation**: 5 points
**Description**:
Implémenter le système d'authentification complet avec Firebase.

**Tâches**:
- Créer les pages de connexion et inscription
- Développer la récupération de mot de passe
- Implémenter la connexion avec Firebase Auth
- Créer les hooks personnalisés pour gérer l'authentification
- Développer le système de protection des routes
- Implémenter la gestion des erreurs d'authentification

**Critères d'acceptation**:
- Inscription, connexion et déconnexion fonctionnent parfaitement
- Les erreurs sont clairement communiquées à l'utilisateur
- La récupération de mot de passe fonctionne
- Les routes protégées ne sont accessibles qu'aux utilisateurs authentifiés
- Les formulaires sont validés avec Zod

### GLOW-010: Espace client - Tableau de bord
**Priorité**: Moyenne
**Estimation**: 5 points
**Description**:
Développer le tableau de bord principal de l'espace client.

**Tâches**:
- Créer le layout de l'espace client avec navigation latérale
- Développer la page d'accueil du tableau de bord
- Implémenter les widgets de résumé (commandes, favoris, etc.)
- Créer le système d'affichage des notifications
- Développer les liens rapides vers les sections
- Afficher les dernières commandes en aperçu

**Critères d'acceptation**:
- Les données sont correctement chargées depuis Firestore
- La navigation entre les sections est fluide
- L'interface est responsive avec vue adaptée pour mobile
- Les widgets affichent les bonnes informations
- La page se charge rapidement

### GLOW-011: Espace client - Gestion du profil
**Priorité**: Moyenne
**Estimation**: 5 points
**Description**:
Développer la section de gestion du profil utilisateur.

**Tâches**:
- Créer le formulaire d'édition du profil
- Implémenter l'upload de photo de profil avec Firebase Storage
- Développer la validation des champs avec Zod
- Créer la gestion des préférences de communication
- Implémenter la modification du mot de passe
- Développer la suppression du compte

**Critères d'acceptation**:
- Les modifications sont correctement enregistrées dans Firestore
- L'upload de photo fonctionne avec Firebase Storage
- La validation des formulaires est fonctionnelle
- Les modifications sont confirmées par des notifications
- L'interface est responsive

### GLOW-012: Espace client - Commandes et factures
**Priorité**: Moyenne
**Estimation**: 8 points
**Description**:
Développer la section de gestion des commandes et factures.

**Tâches**:
- Créer la liste des commandes avec filtrage
- Développer la page de détail d'une commande
- Implémenter la génération de facture PDF
- Créer le suivi de commande avec étapes
- Développer les actions possibles sur les commandes
- Implémenter l'historique des statuts

**Critères d'acceptation**:
- Les commandes sont correctement chargées depuis Firestore
- Les détails d'une commande sont clairement affichés
- Les factures PDF peuvent être générées et téléchargées
- Le suivi de commande est visuel et clair
- L'interface est responsive

### GLOW-013: Espace client - Adresses
**Priorité**: Moyenne
**Estimation**: 3 points
**Description**:
Développer la gestion des adresses de livraison et facturation.

**Tâches**:
- Créer la liste des adresses enregistrées
- Développer le formulaire d'ajout/modification d'adresse
- Implémenter la validation avec Zod
- Créer le système d'adresse par défaut
- Développer la suppression d'adresse
- Implémenter la synchronisation avec Firestore

**Critères d'acceptation**:
- Les adresses sont correctement gérées (ajout, modification, suppression)
- La validation des formulaires fonctionne
- Les modifications sont enregistrées dans Firestore
- L'interface est responsive
- Les notifications confirment les actions

### GLOW-014: Système de favoris et wishlist
**Priorité**: Basse
**Estimation**: 5 points
**Description**:
Développer le système de favoris et wishlist publique.

**Tâches**:
- Créer le store Zustand pour la gestion des favoris
- Développer les fonctionnalités d'ajout/suppression aux favoris
- Créer la page de liste des favoris
- Implémenter la wishlist publique avec lien partageable
- Développer les paramètres de visibilité de la wishlist
- Implémenter la synchronisation avec Firestore

**Critères d'acceptation**:
- L'ajout et la suppression des favoris fonctionnent
- Les favoris sont synchronisés avec Firestore
- La wishlist publique est accessible via un lien
- Les paramètres de visibilité sont fonctionnels
- L'interface est responsive

### GLOW-015: Gestion des bons de réduction
**Priorité**: Basse
**Estimation**: 3 points
**Description**:
Implémenter le système de gestion des bons de réduction dans l'espace client.

**Tâches**:
- Créer la liste des bons de réduction disponibles
- Développer l'affichage des détails (montant, validité, conditions)
- Implémenter la copie du code promo en un clic
- Créer les alertes d'expiration
- Développer l'historique des bons utilisés
- Implémenter la synchronisation avec Firestore

**Critères d'acceptation**:
- Les bons sont correctement chargés depuis Firestore
- La copie du code fonctionne
- Les bons expirés sont clairement identifiés
- L'interface est responsive
- Les notifications sont claires

### GLOW-016: Pages catégories (Style, Vibe, Matériaux)
**Priorité**: Moyenne
**Estimation**: 5 points
**Description**:
Développer les pages de catégories avec contenu spécifique.

**Tâches**:
- Créer le template pour les pages Style (mini-hoops, ear-cuffs, etc.)
- Développer le template pour les pages Vibe (chic, bold, etc.)
- Implémenter le template pour les pages Matériaux (résine, acier, etc.)
- Créer les bannières spécifiques à chaque catégorie
- Développer les filtres spécifiques par catégorie
- Implémenter le chargement dynamique des produits depuis Firestore

**Critères d'acceptation**:
- Les pages utilisent les données de Firestore
- Chaque catégorie a son identité visuelle
- La navigation entre catégories est intuitive
- Les bannières sont attractives
- L'interface est responsive

### GLOW-017: Optimisation des performances et SEO
**Priorité**: Moyenne
**Estimation**: 5 points
**Description**:
Optimiser les performances du site et le SEO.

**Tâches**:
- Implémenter le lazy loading des images
- Optimiser les Core Web Vitals
- Créer les métadonnées pour chaque page
- Développer le sitemap dynamique
- Implémenter les schémas JSON-LD pour les produits
- Optimiser le cache et le bundle size
- Mettre en place l'analyse des performances

**Critères d'acceptation**:
- Score Lighthouse supérieur à 90 sur tous les critères
- Temps de chargement initial inférieur à 3s
- Métadonnées correctement implémentées
- Schémas JSON-LD valides
- Bundle size optimisé

### GLOW-018: Pages informatives et légales
**Priorité**: Basse
**Estimation**: 3 points
**Description**:
Développer les pages informatives et légales du site.

**Tâches**:
- Créer la page À propos avec contenu et images
- Développer la page FAQ complète avec accordéon
- Implémenter les pages légales (CGV, Mentions légales, etc.)
- Créer la page Contact avec formulaire
- Développer la page de politique de confidentialité
- Implémenter le consentement aux cookies

**Critères d'acceptation**:
- Toutes les pages sont responsives
- Le formulaire de contact fonctionne et envoie les messages
- Les textes légaux sont formatés correctement
- La FAQ est facile à naviguer
- Le consentement aux cookies est conforme au RGPD

### GLOW-019: Tests et assurance qualité
**Priorité**: Élevée
**Estimation**: 5 points
**Description**:
Mettre en place les tests et assurer la qualité du code.

**Tâches**:
- Implémenter les tests unitaires pour les composants critiques
- Développer les tests d'intégration pour les principaux flux
- Créer les tests e2e pour le parcours d'achat
- Mettre en place l'accessibilité (WCAG)
- Corriger les bugs identifiés
- Optimiser la compatibilité navigateurs

**Critères d'acceptation**:
- Couverture de tests > 80% pour les composants critiques
- Parcours d'achat testé de bout en bout
- Aucun problème d'accessibilité majeur
- Compatible avec les navigateurs modernes
- Responsive sur tous les appareils

### GLOW-020: Déploiement et CI/CD
**Priorité**: Moyenne
**Estimation**: 3 points
**Description**:
Mettre en place le déploiement et l'intégration continue.

**Tâches**:
- Configurer le pipeline CI/CD avec GitHub Actions
- Mettre en place les environnements (dev, staging, prod)
- Implémenter les vérifications pré-déploiement
- Configurer le déploiement automatique
- Mettre en place la surveillance des performances
- Implémenter la gestion des erreurs côté client

**Critères d'acceptation**:
- Le pipeline CI/CD fonctionne correctement
- Les déploiements sont automatisés
- Les erreurs sont correctement loguées et surveillées
- Le rollback est possible en cas de problème
- Les performances sont surveillées

### GLOW-021: Refonte de la Navbar et structure de navigation
**Priorité**: Élevée
**Estimation**: 8 points
**Description**:
Restructurer la navbar pour refléter la richesse de la navbar d'origine tout en optimisant la navigation pour la cible (femmes 15-30 ans) et en implémentant la redirection vers la boutique avec filtres pré-appliqués.

**Tâches**:
- Mettre à jour la structure navigationData dans MainNavigation.tsx
- Implémenter les catégories principales (Style, Vibe, Matériaux) avec leurs sous-menus optimisés
- Ajouter les catégories manquantes (Nouveautés, Collections, Tendances, Pierres)
- Développer le système de redirection vers la boutique avec filtres pré-appliqués
- Créer des pages dynamiques pour les sous-catégories (ex: /style/[subcategory])
- Assurer la cohérence entre la version desktop et mobile
- Implémenter les animations et transitions de la navbar

**Critères d'acceptation**:
- La navbar reflète la richesse de la navbar d'origine
- Les redirections vers la boutique avec filtres fonctionnent correctement
- L'expérience utilisateur est fluide et intuitive
- La navbar est responsive et fonctionne sur tous les appareils
- Les animations sont subtiles et professionnelles

### GLOW-022: Optimisation des sous-menus par catégorie
**Priorité**: Moyenne
**Estimation**: 5 points
**Description**:
Optimiser les sous-menus des catégories principales (Style, Vibe, Matériaux) en fonction des tendances 2025 et de la cible démographique.

**Tâches**:
- Restructurer les sous-menus Style avec les catégories tendance (Mini-hoops, Ear cuffs, Pendants, Studs, Créoles, XXL, Asymétriques)
- Optimiser les sous-menus Vibe avec les catégories recommandées (Chic, Bold, Casual, Bohème, Minimaliste, Vintage)
- Mettre à jour les sous-menus Matériaux (Résine, Acier, Plaqué or, Argent, Perles, Pierres naturelles)
- Créer les icônes ou visuels associés à chaque sous-catégorie
- Implémenter les filtres correspondants dans la page boutique
- Assurer la cohérence des données entre la navbar et Firestore

**Critères d'acceptation**:
- Les sous-menus reflètent les tendances actuelles en bijouterie
- Les catégories sont pertinentes pour la cible démographique (15-30 ans)
- Les filtres correspondants fonctionnent correctement dans la boutique
- L'interface est intuitive et esthétique
- La navigation est fluide entre les différentes catégories

### GLOW-023: Implémentation des pages Nouveautés et Promos
**Priorité**: Élevée
**Estimation**: 5 points
**Description**:
Développer les pages Nouveautés et Promos complètes pour répondre aux attentes de la cible démographique (15-30 ans).

**Tâches**:
- Créer la page Nouveautés avec affichage des produits récemment ajoutés
- Développer la page Promos avec mise en avant des offres spéciales
- Implémenter le système de filtrage spécifique à ces pages
- Créer les bannières et éléments visuels attractifs
- Développer le système de tri (par date, par popularité, par prix)
- Intégrer un système de notification pour les nouvelles arrivées

**Critères d'acceptation**:
- Les pages affichent correctement les produits depuis Firestore
- Le système de filtrage et de tri fonctionne efficacement
- L'interface est attractive et incite à l'achat
- Les pages sont responsives sur tous les appareils
- Les performances de chargement sont optimisées

### GLOW-024: Système de redirection avec filtres pré-appliqués
**Priorité**: Moyenne
**Estimation**: 3 points
**Description**:
Développer un système permettant de rediriger l'utilisateur vers la page boutique avec des filtres pré-appliqués lorsqu'il clique sur un élément de sous-menu.

**Tâches**:
- Créer un système de génération d'URL avec paramètres de filtrage
- Implémenter la logique de redirection dans les composants de navigation
- Développer la fonctionnalité de lecture des paramètres d'URL dans la page boutique
- Assurer la persistance des filtres dans l'URL pour le partage
- Optimiser les performances de chargement avec filtres pré-appliqués
- Tester la compatibilité avec différents navigateurs

**Critères d'acceptation**:
- Les redirections fonctionnent correctement depuis tous les éléments de menu
- Les filtres sont correctement appliqués à l'arrivée sur la page boutique
- L'URL reflète les filtres sélectionnés et peut être partagée
- L'expérience utilisateur est fluide sans rechargement inutile
- Le système fonctionne sur tous les navigateurs modernes

### GLOW-025: Implémentation des pages Packs et Abonnement
**Priorité**: Élevée
**Estimation**: 8 points
**Description**:
Développer les pages Packs et Abonnement complètes pour offrir des options d'achat groupé et d'abonnement mensuel à la cible démographique (15-30 ans).

**Tâches**:
- Créer la page principale des Packs avec filtrage par catégorie
- Développer les pages détaillées pour chaque pack
- Implémenter le système de comparaison des packs
- Créer la page Abonnement avec présentation de la GlowBox mensuelle
- Développer le système d'inscription et de gestion d'abonnement
- Intégrer les options de personnalisation pour l'abonnement
- Créer les bannières et éléments visuels attractifs
- Implémenter le système de paiement récurrent pour l'abonnement

**Critères d'acceptation**:
- Les pages affichent correctement les produits depuis Firestore
- Le système d'abonnement fonctionne avec paiement récurrent
- Les options de personnalisation sont fonctionnelles
- L'interface est attractive et incite à l'achat
- Les pages sont responsives sur tous les appareils
- Les performances de chargement sont optimisées