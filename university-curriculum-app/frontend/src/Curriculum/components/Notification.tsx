import React, { useEffect } from 'react';
import type{ ToastData } from '../types';

interface Props {
  toast: ToastData | null;
  onClose: () => void;
}

export const NotificationToast: React.FC<Props> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 16,
      right: 16,
      background: toast.type === 'error' ? '#fee2e2' : '#dcfce7',
      border: `1px solid ${toast.type === 'error' ? '#fca5a5' : '#86efac'}`,
      borderRadius: 6,
      padding: '12px 16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 10000,
      color: toast.type === 'error' ? '#991b1b' : '#166534',
      fontSize: 13,
      fontWeight: 500,
      animation: 'slideIn 300ms ease-out',
    }}>
      {toast.message}
    </div>
  );
};