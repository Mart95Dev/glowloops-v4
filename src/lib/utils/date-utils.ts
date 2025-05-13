/**
 * Formate une date au format français (jour/mois/année)
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Vérifie si une date est proche de l'expiration (moins de jours spécifiés)
 */
export const isNearExpiry = (date: Date, daysThreshold = 7): boolean => {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 && diffDays <= daysThreshold;
};

/**
 * Formate une date au format relatif (il y a X jours, dans X jours)
 */
export const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return `Il y a ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's' : ''}`;
  } else if (diffDays === 0) {
    return "Aujourd'hui";
  } else {
    return `Dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  }
}; 