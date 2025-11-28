import React from 'react';

export default function Badge({ children, variant = 'stable' }) {
    const variants = {
        critical: 'bg-clinical-red-100 text-clinical-red-700 border-clinical-red-200',
        stable: 'bg-clinical-blue-100 text-clinical-blue-700 border-clinical-blue-200',
        success: 'bg-clinical-green-100 text-clinical-green-700 border-clinical-green-200',
        warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}>
            {children}
        </span>
    );
}
