/**
 * Utilitaires pour travailler avec Firebase Storage
 */

import { getStorageFileUrl } from '../firebase/firebase-config';

/**
 * Extrait le chemin du fichier à partir d'une URL Firebase Storage
 * @param url - URL complète du fichier Firebase Storage
 * @returns Chemin du fichier dans Firebase Storage
 */
export const extractStoragePath = (url: string): string => {
  try {
    // Format de l'URL: https://storage.googleapis.com/[bucket]/[path]?[params]
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    
    // Ignorer le premier élément vide et le nom du bucket
    const path = pathParts.slice(2).join('/');
    
    return path;
  } catch (error) {
    console.error('Erreur lors de l\'extraction du chemin de stockage:', error);
    return '';
  }
};

/**
 * Génère une nouvelle URL publique pour un fichier Firebase Storage
 * @param url - URL actuelle du fichier
 * @returns Promise avec la nouvelle URL publique
 */
export const refreshStorageUrl = async (url: string): Promise<string> => {
  // Vérifier si l'URL est valide
  if (!url) {
    console.error('URL d\'image manquante ou invalide');
    // Retourner une URL par défaut pour éviter les erreurs
    return 'https://firebasestorage.googleapis.com/v0/b/glowloops-v3.appspot.com/o/placeholder.png?alt=media';
  }
  
  // Si ce n'est pas une URL Firebase Storage, la retourner telle quelle
  if (!url.includes('storage.googleapis.com')) {
    return url;
  }
  
  try {
    // Extraire le chemin du fichier
    const path = extractStoragePath(url);
    if (!path) {
      console.warn('Impossible d\'extraire le chemin du fichier:', url);
      return url;
    }
    
    // Générer une nouvelle URL
    const newUrl = await getStorageFileUrl(path);
    if (!newUrl) {
      console.warn('Impossible de générer une nouvelle URL pour:', path);
      return url;
    }
    
    return newUrl;
  } catch (error) {
    console.error('Erreur lors du rafraîchissement de l\'URL:', error);
    return url;
  }
};
