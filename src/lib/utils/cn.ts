import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utilitaire pour fusionner les classes CSS avec tailwind-merge
 * Permet de combiner des classes conditionnelles et de résoudre les conflits
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
