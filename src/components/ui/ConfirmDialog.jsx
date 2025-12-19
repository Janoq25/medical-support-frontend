'use client';

import { X } from 'lucide-react';
import Button from './Button';

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger', // 'danger' | 'warning' | 'info'
    isLoading = false,
}) {
    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            bg: 'bg-status-error/10',
            border: 'border-status-error/20',
            text: 'text-status-error',
            button: 'bg-status-error hover:bg-red-600',
        },
        warning: {
            bg: 'bg-terracotta-50',
            border: 'border-terracotta-200',
            text: 'text-terracotta-800',
            button: 'bg-terracotta-500 hover:bg-terracotta-600',
        },
        info: {
            bg: 'bg-sage-50',
            border: 'border-sage-200',
            text: 'text-sage-800',
            button: 'bg-sage-600 hover:bg-sage-700',
        },
    };

    const styles = variantStyles[variant] || variantStyles.info;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-900/20 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-soft max-w-md w-full animate-slideUp">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-sage-100">
                    <h3 className="text-xl font-bold text-sage-900">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="p-2 rounded-full hover:bg-sage-100 text-sage-400 hover:text-sage-600 transition-colors disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className={`${styles.bg} ${styles.border} border rounded-2xl p-5`}>
                        <p className={`${styles.text} text-sm font-medium leading-relaxed`}>
                            {message}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 p-6 border-t border-sage-100">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-full sm:w-auto rounded-full text-sage-600 hover:bg-sage-50"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`w-full sm:w-auto rounded-full shadow-lg shadow-sage-200/50 ${styles.button} text-white border-none`}
                    >
                        {isLoading ? 'Procesando...' : confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}
