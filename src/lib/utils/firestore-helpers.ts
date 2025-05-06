/**
 * Utilitaires pour travailler avec les données Firestore
 */

/**
 * Convertit un objet Timestamp Firestore en Date JavaScript
 * @param timestamp - Timestamp Firestore
 * @returns Date JavaScript
 */
export const timestampToDate = (timestamp: { seconds: number; nanoseconds: number }): Date => {
  if (!timestamp) return new Date();
  return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
};

/**
 * Convertit un objet Timestamp Firestore en chaîne de date ISO
 * @param timestamp - Timestamp Firestore
 * @returns Chaîne de date ISO
 */
export const timestampToISOString = (timestamp: { seconds: number; nanoseconds: number }): string => {
  return timestampToDate(timestamp).toISOString();
};

// Type pour les Timestamps Firestore

/**
 * Type pour les Timestamps Firestore
 */
interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

/**
 * Vérifie si un objet est un Timestamp Firestore
 * @param value - Valeur à vérifier
 * @returns true si c'est un Timestamp Firestore
 */
const isFirestoreTimestamp = (value: unknown): value is FirestoreTimestamp => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'seconds' in value &&
    'nanoseconds' in value &&
    typeof (value as FirestoreTimestamp).seconds === 'number' &&
    typeof (value as FirestoreTimestamp).nanoseconds === 'number'
  );
};

/**
 * Convertit un objet Firestore en objet JavaScript simple
 * en convertissant les Timestamps en dates ISO
 * @param obj - Objet Firestore
 * @returns Objet JavaScript simple
 */
export const convertFirestoreData = <T>(obj: unknown): T => {
  if (!obj) return {} as unknown as T;
  
  // Si c'est un tableau, convertir chaque élément
  if (Array.isArray(obj)) {
    return obj.map(item => convertFirestoreData(item)) as unknown as T;
  }
  
  // Si ce n'est pas un objet ou est null, retourner tel quel
  if (typeof obj !== 'object' || obj === null) {
    return obj as T;
  }
  
  // Convertir l'objet
  const result: Record<string, unknown> = {};
  const objRecord = obj as Record<string, unknown>;
  
  for (const key in objRecord) {
    if (Object.prototype.hasOwnProperty.call(objRecord, key)) {
      const value = objRecord[key];
      
      // Vérifier si c'est un Timestamp
      if (isFirestoreTimestamp(value)) {
        result[key] = timestampToISOString(value);
      } 
      // Vérifier si c'est un objet qui pourrait contenir des Timestamps
      else if (typeof value === 'object' && value !== null) {
        result[key] = convertFirestoreData(value);
      } 
      // Sinon, conserver la valeur telle quelle
      else {
        result[key] = value;
      }
    }
  }
  
  return result as T;
};
