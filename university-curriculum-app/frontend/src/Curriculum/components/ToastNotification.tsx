import React from 'react';
import type { ToastState } from '../types';

interface Props {
  toast: ToastState;
}

export const ToastNotification: React.FC<Props> = ({ toast }) => {
  if (!toast) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 80,
      right: 24,
      background: toast.type === 'error' ? '#fee2e2' : '#dcfce7',
      border: `1px solid ${toast.type === 'error' ? '#fca5a5' : '#86efac'}`,
      borderRadius: 6,
      padding: '12px 16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 10000,
      color: toast.type === 'error' ? '#991b1b' : '#166534',
      fontSize: 14,
      fontWeight: 600,
      animation: 'slideIn 300ms ease-out',
      maxWidth: 400,
    }}>
      {toast.message}
    </div>
  );
};