import { toast } from '@/components/ui/toast-utils';
import { ToastActionElement } from '@/components/ui/Toast';

type ToastOptions = {
  description?: string;
  action?: ToastActionElement;
  duration?: number;
};

export const toastUtils = {
  success: (title: string, options?: ToastOptions) => {
    toast({
      title,
      description: options?.description,
      className: 'bg-green-100 border-green-500 text-green-800',
      action: options?.action,
      duration: options?.duration,
    });
  },
  
  error: (title: string, options?: ToastOptions) => {
    toast({
      title,
      description: options?.description,
      className: 'bg-red-100 border-red-500 text-red-800',
      action: options?.action,
      duration: options?.duration,
    });
  },
  
  info: (title: string, options?: ToastOptions) => {
    toast({
      title,
      description: options?.description,
      action: options?.action,
      duration: options?.duration,
    });
  },
  
  warning: (title: string, options?: ToastOptions) => {
    toast({
      title,
      description: options?.description,
      className: 'bg-yellow-100 border-yellow-500 text-yellow-800',
      action: options?.action,
      duration: options?.duration,
    });
  },
};
