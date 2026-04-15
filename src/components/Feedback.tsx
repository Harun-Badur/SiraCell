import { Toaster, toast as hotToast } from 'react-hot-toast';
import type { ToastOptions } from 'react-hot-toast';

export const FeedbackToaster = () => {
    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
                duration: 4000,
                style: {
                    background: '#ffffff',
                    color: '#002855',
                    boxShadow: '0 8px 32px rgba(0, 40, 85, 0.18)',
                    borderRadius: '1.25rem',
                    padding: '16px 20px',
                    fontWeight: 800,
                    fontSize: '0.9375rem',
                    border: '2px solid #e2e8f0',
                },
                success: {
                    iconTheme: {
                        primary: '#ffcc00', // Turkcell Yellow
                        secondary: '#002855', // Dark Blue
                    },
                    style: {
                        border: '2px solid #ffcc00',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#ef4444', 
                        secondary: '#ffffff',
                    },
                    style: {
                        border: '2px solid #fecaca',
                    },
                },
            }}
        />
    );
};

export const toast = {
    loading: (msg: string, opts?: ToastOptions) => hotToast.loading(msg, opts),
    success: (msg: string, opts?: ToastOptions) => hotToast.success(msg, opts),
    error: (msg: string, opts?: ToastOptions) => hotToast.error(msg, opts),
    dismiss: (id?: string) => hotToast.dismiss(id),
};
