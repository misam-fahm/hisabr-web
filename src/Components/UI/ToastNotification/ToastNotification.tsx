import React, { useEffect } from 'react';
import { toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export interface ToastNotificationProps {
  message: string;
  type?: string;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ message, type = 'success' }) => {
  const showToast = () => {
    const toastOptions: ToastOptions = {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeButton: true,
      draggable: true,
    };

    switch (type) {
      case 'error':
        toast.error(message, toastOptions);
        break;
      case 'info':
        toast.info(message, toastOptions);
        break;
      case 'warning':
        toast.warning(message, toastOptions);
        break;
      default:
        toast.success(message, toastOptions);
        break;
    }
  };

  useEffect(() => {
    if (message) {
      showToast();
    }
  }, [message,type]);

  return null;
};

export default ToastNotification;
