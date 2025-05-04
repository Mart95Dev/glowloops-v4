// Utilitaire simple pour les notifications toast

type ToastOptions = {
  description?: string;
  duration?: number;
};

// Fonction pour créer un élément de toast et l'ajouter au DOM
const createToast = (message: string, type: 'success' | 'error' | 'info' | 'warning', options?: ToastOptions) => {
  // Vérifier si nous sommes côté client
  if (typeof window === 'undefined') return;
  
  // Créer le conteneur de toast s'il n'existe pas déjà
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.position = 'fixed';
    toastContainer.style.top = '1rem';
    toastContainer.style.right = '1rem';
    toastContainer.style.zIndex = '9999';
    toastContainer.style.display = 'flex';
    toastContainer.style.flexDirection = 'column';
    toastContainer.style.gap = '0.5rem';
    document.body.appendChild(toastContainer);
  }
  
  // Créer l'élément toast
  const toast = document.createElement('div');
  toast.style.padding = '1rem';
  toast.style.borderRadius = '0.375rem';
  toast.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
  toast.style.display = 'flex';
  toast.style.flexDirection = 'column';
  toast.style.minWidth = '300px';
  toast.style.maxWidth = '400px';
  toast.style.animation = 'slideIn 0.3s ease-out forwards';
  toast.style.opacity = '0';
  toast.style.transform = 'translateX(100%)';
  
  // Définir les couleurs en fonction du type
  switch (type) {
    case 'success':
      toast.style.backgroundColor = '#ecfdf5';
      toast.style.borderLeft = '4px solid #10b981';
      toast.style.color = '#065f46';
      break;
    case 'error':
      toast.style.backgroundColor = '#fef2f2';
      toast.style.borderLeft = '4px solid #ef4444';
      toast.style.color = '#991b1b';
      break;
    case 'warning':
      toast.style.backgroundColor = '#fffbeb';
      toast.style.borderLeft = '4px solid #f59e0b';
      toast.style.color = '#92400e';
      break;
    case 'info':
    default:
      toast.style.backgroundColor = '#eff6ff';
      toast.style.borderLeft = '4px solid #3b82f6';
      toast.style.color = '#1e40af';
      break;
  }
  
  // Ajouter le message
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.style.fontWeight = 'bold';
  toast.appendChild(messageElement);
  
  // Ajouter la description si elle existe
  if (options?.description) {
    const descriptionElement = document.createElement('div');
    descriptionElement.textContent = options.description;
    descriptionElement.style.fontSize = '0.875rem';
    descriptionElement.style.marginTop = '0.25rem';
    toast.appendChild(descriptionElement);
  }
  
  // Ajouter le toast au conteneur
  toastContainer.appendChild(toast);
  
  // Ajouter la règle d'animation si elle n'existe pas déjà
  if (!document.getElementById('toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Appliquer l'animation d'entrée
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  }, 10);
  
  // Supprimer le toast après un délai
  const duration = options?.duration || 5000;
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-in forwards';
    setTimeout(() => {
      if (toastContainer.contains(toast)) {
        toastContainer.removeChild(toast);
      }
      // Supprimer le conteneur s'il est vide
      if (toastContainer.childNodes.length === 0) {
        document.body.removeChild(toastContainer);
      }
    }, 300);
  }, duration);
};

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    createToast(message, 'success', options);
  },
  
  error: (message: string, options?: ToastOptions) => {
    createToast(message, 'error', options);
  },
  
  info: (message: string, options?: ToastOptions) => {
    createToast(message, 'info', options);
  },
  
  warning: (message: string, options?: ToastOptions) => {
    createToast(message, 'warning', options);
  }
};
