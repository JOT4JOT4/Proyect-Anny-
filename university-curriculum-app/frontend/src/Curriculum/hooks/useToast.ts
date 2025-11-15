import { useState, useEffect } from 'react';
import type { ToastState } from '../types';

export const useToast = (duration = 3500) => {
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), duration);
      return () => clearTimeout(timer);
    }
  }, [toast, duration]);

  return { toast, setToast };
};