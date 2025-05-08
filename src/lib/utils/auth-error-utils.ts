/**
 * Utilitaire pour traduire les codes d'erreur Firebase Auth en messages d'erreur compréhensibles
 */

// Codes d'erreur Firebase Auth
// Liste complète : https://firebase.google.com/docs/auth/admin/errors
type FirebaseAuthErrorCode =
  | 'auth/email-already-in-use'
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/weak-password'
  | 'auth/too-many-requests'
  | 'auth/popup-closed-by-user'
  | 'auth/network-request-failed'
  | 'auth/operation-not-allowed'
  | 'auth/account-exists-with-different-credential'
  | 'auth/invalid-credential'
  | 'auth/invalid-verification-code'
  | 'auth/invalid-verification-id'
  | 'auth/requires-recent-login'
  | 'auth/expired-action-code'
  | 'auth/invalid-action-code'
  | 'auth/missing-phone-number'
  | 'auth/invalid-phone-number'
  | 'auth/quota-exceeded'
  | 'auth/captcha-check-failed'
  | 'auth/missing-verification-code'
  | 'auth/code-expired'
  | 'auth/recaptcha-not-enabled'
  | string; // Pour capturer les codes non explicitement listés

/**
 * Convertit un code d'erreur Firebase Auth en message compréhensible
 * @param errorCode Code d'erreur Firebase
 * @returns Message d'erreur en français
 */
export function getAuthErrorMessage(errorCode: FirebaseAuthErrorCode): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Cette adresse email est déjà utilisée par un autre compte.';
    case 'auth/invalid-email':
      return 'L\'adresse email est invalide.';
    case 'auth/user-disabled':
      return 'Ce compte a été désactivé.';
    case 'auth/user-not-found':
      return 'Aucun compte n\'est associé à cette adresse email.';
    case 'auth/wrong-password':
      return 'Le mot de passe est incorrect.';
    case 'auth/weak-password':
      return 'Le mot de passe est trop faible. Il doit contenir au moins 6 caractères.';
    case 'auth/too-many-requests':
      return 'Trop de tentatives. Veuillez réessayer plus tard.';
    case 'auth/popup-closed-by-user':
      return 'La fenêtre d\'authentification a été fermée avant la fin du processus.';
    case 'auth/network-request-failed':
      return 'Une erreur de réseau est survenue. Vérifiez votre connexion.';
    case 'auth/operation-not-allowed':
      return 'Cette opération n\'est pas autorisée.';
    case 'auth/account-exists-with-different-credential':
      return 'Un compte existe déjà avec cette adresse email mais avec une méthode de connexion différente.';
    case 'auth/invalid-credential':
      return 'Les informations d\'identification sont invalides.';
    case 'auth/invalid-verification-code':
      return 'Le code de vérification est invalide.';
    case 'auth/invalid-verification-id':
      return 'L\'identifiant de vérification est invalide.';
    case 'auth/requires-recent-login':
      return 'Cette opération nécessite une authentification récente. Veuillez vous reconnecter.';
    case 'auth/expired-action-code':
      return 'Ce lien a expiré. Veuillez réessayer.';
    case 'auth/invalid-action-code':
      return 'Ce lien est invalide ou a déjà été utilisé.';
    // Erreurs spécifiques à l'authentification par SMS
    case 'auth/missing-phone-number':
      return 'Veuillez entrer un numéro de téléphone.';
    case 'auth/invalid-phone-number':
      return 'Le numéro de téléphone est invalide.';
    case 'auth/quota-exceeded':
      return 'Limite de SMS dépassée. Veuillez réessayer plus tard.';
    case 'auth/captcha-check-failed':
      return 'La vérification du CAPTCHA a échoué. Veuillez réessayer.';
    case 'auth/missing-verification-code':
      return 'Veuillez entrer le code de vérification.';
    case 'auth/code-expired':
      return 'Ce code a expiré. Veuillez demander un nouveau code.';
    case 'auth/recaptcha-not-enabled':
      return 'reCAPTCHA n\'est pas configuré correctement. Veuillez contacter le support.';
    default:
      return 'Une erreur est survenue. Veuillez réessayer.';
  }
}

/**
 * Extrait le code d'erreur Firebase à partir d'un objet Error
 * @param error Objet erreur de Firebase
 * @returns Code d'erreur ou chaîne vide si non trouvé
 */
export function extractFirebaseErrorCode(error: unknown): FirebaseAuthErrorCode {
  if (error instanceof Error) {
    // Format typique: "Firebase: Error (auth/invalid-email)."
    const regex = /\(([^)]+)\)/;
    const matches = regex.exec(error.message);
    if (matches && matches.length > 1) {
      return matches[1] as FirebaseAuthErrorCode;
    }
    
    // Si le format est différent mais contient auth/
    if (error.message.includes('auth/')) {
      const authCode = error.message.split('auth/')[1]?.split(' ')[0]?.split(')')[0];
      if (authCode) {
        return `auth/${authCode}` as FirebaseAuthErrorCode;
      }
    }
    
    return error.message as FirebaseAuthErrorCode;
  }
  
  return 'unknown-error';
} 