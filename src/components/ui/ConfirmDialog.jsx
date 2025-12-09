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
            bg: 'bg-clinical-red-50',
            border: 'border-clinical-red-200',
            text: 'text-clinical-red-700',
            button: 'bg-clinical-red-600 hover:bg-clinical-red-700',
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            text: 'text-yellow-700',
            button: 'bg-yellow-600 hover:bg-yellow-700',
        },
        info: {
            bg: 'bg-clinical-blue-50',
            border: 'border-clinical-blue-200',
            text: 'text-clinical-blue-700',
            button: 'bg-clinical-blue-600 hover:bg-clinical-blue-700',
        },
    };

    const styles = variantStyles[variant];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-slideUp">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-clinical-gray-200">
                    <h3 className="text-lg font-semibold text-clinical-gray-900">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-clinical-gray-400 hover:text-clinical-gray-600 transition-colors disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className={`${styles.bg} ${styles.border} border rounded-lg p-4`}>
                        <p className={`${styles.text} text-sm`}>
                            {message}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 p-6 border-t border-clinical-gray-200">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-full sm:w-auto"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`w-full sm:w-auto ${styles.button} text-white`}
                    >
                        {isLoading ? 'Procesando...' : confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}
