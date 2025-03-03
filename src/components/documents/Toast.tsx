import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
  className?: string;
}

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 5000, className }) => {
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
          className={`absolute bottom-0 left-0 h-1 rounded-b-lg animate-timer ${className}`}
          style={{ animationDuration: `${duration}ms` }} 
        />
      </div>
    </div>
  );
};

export default Toast;