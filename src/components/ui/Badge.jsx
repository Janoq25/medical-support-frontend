import React from 'react';

export default function Badge({ children, variant = 'stable' }) {
    const variants = {
        critical: 'bg-status-error/10 text-status-error border-status-error/20',
        stable: 'bg-sage-100 text-sage-700 border-sage-200',
        success: 'bg-sage-100 text-sage-800 border-sage-200',
        warning: 'bg-terracotta-100 text-terracotta-800 border-terracotta-200',
        info: 'bg-sand-100 text-sand-700 border-sand-200',
    };

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${variants[variant] || variants.stable}`}>
            {children}
        </span>
    );
}
