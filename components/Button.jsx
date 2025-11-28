import React from 'react';

export default function Button({
    children,
    variant = 'primary',
    onClick,
    type = 'button',
    className = '',
    disabled = false
}) {
    const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer';

    const variants = {
        primary: 'bg-clinical-blue-600 text-white hover:bg-clinical-blue-700 focus:ring-clinical-blue-500 disabled:bg-clinical-gray-300 disabled:cursor-not-allowed',
        outline: 'border-2 border-clinical-gray-300 text-clinical-gray-700 hover:bg-clinical-gray-50 focus:ring-clinical-gray-400 disabled:border-clinical-gray-200 disabled:text-clinical-gray-400 disabled:cursor-not-allowed',
        ghost: 'text-clinical-gray-700 hover:bg-clinical-gray-100 focus:ring-clinical-gray-400',
        danger: 'bg-clinical-red-600 text-white hover:bg-clinical-red-700 focus:ring-clinical-red-500',
        success: 'bg-clinical-green-600 text-white hover:bg-clinical-green-700 focus:ring-clinical-green-500',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}
