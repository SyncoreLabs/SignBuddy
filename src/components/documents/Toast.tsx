import React, { useEffect } from 'react';

type ToastType = 'success' | 'warning' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
  className?: string;
}

const toastColors: Record<ToastType, string> = {
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500'
};

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 5000, className }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto z-50 animate-slide-up">
      <div className="bg-black/90 px-4 md:px-6 py-3 md:py-4 rounded-lg border border-white/10 shadow-lg relative overflow-hidden max-w-[90vw] md:max-w-md mx-auto md:mx-0">
        <p className="text-white text-sm md:text-base">{message}</p>
        <div 
          className={`absolute bottom-0 left-0 h-1 rounded-b-lg animate-timer ${toastColors[type]} ${className}`}
          style={{ animationDuration: `${duration}ms` }} 
        />
      </div>
    </div>
  );
};

// Utility functions to create specific toast types
export const createSuccessToast = (message: string, duration?: number) => (
  <Toast type="success" message={message} duration={duration} onClose={() => {}} />
);

export const createWarningToast = (message: string, duration?: number) => (
  <Toast type="warning" message={message} duration={duration} onClose={() => {}} />
);

export const createErrorToast = (message: string, duration?: number) => (
  <Toast type="error" message={message} duration={duration} onClose={() => {}} />
);

export default Toast;