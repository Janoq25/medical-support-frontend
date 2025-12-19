import React from 'react';

export default function Button({
    children,
    variant = 'primary',
    onClick,
    type = 'button',
    className = '',
    disabled = false
}) {
    const baseStyles = 'px-6 py-2.5 rounded-full font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95';

    const variants = {
        primary: 'bg-sage-500 text-white hover:bg-sage-700 focus:ring-sage-500 hover:shadow-md hover:shadow-sage-200/50',
        secondary: 'bg-white text-sage-800 border border-sage-200 hover:bg-sage-50 focus:ring-sage-400',
        outline: 'bg-transparent border-2 border-sage-300 text-sage-700 hover:bg-sage-50 focus:ring-sage-400',
        ghost: 'bg-transparent text-sage-700 hover:bg-sage-100/50 focus:ring-sage-400',
        danger: 'bg-status-error text-white hover:brightness-90 focus:ring-red-400',
        success: 'bg-status-success text-white hover:brightness-90 focus:ring-green-400',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
        >
            {children}
        </button>
    );
}
