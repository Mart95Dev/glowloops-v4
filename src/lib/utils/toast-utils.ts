import { toast } from '@/components/ui/toast-utils';
import { ToastAction } from '@/components/ui/Toast';

type ToastOptions = {
  description?: string;
  action?: React.ReactNode;
  duration?: number;
};

export const toastUtils = {
  success: (title: string, options?: ToastOptions) => {
    toast({
      title,
      description: options?.description,
      variant: 'success',
      action: options?.action,
      duration: options?.duration,
    });
  },
  
  error: (title: string, options?: ToastOptions) => {
    toast({
      title,
      description: options?.description,
      variant: 'destructive',
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
      variant: 'warning',
      action: options?.action,
      duration: options?.duration,
    });
  },
};
