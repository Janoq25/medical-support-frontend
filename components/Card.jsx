import React from 'react';

export default function Card({ children, className = '', hover = false }) {
    return (
        <div
            className={`bg-white rounded-xl border border-clinical-gray-200 shadow-sm ${hover ? 'transition-shadow hover:shadow-md' : ''
                } ${className}`}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }) {
    return (
        <div className={`px-6 py-4 border-b border-clinical-gray-200 ${className}`}>
            {children}
        </div>
    );
}

export function CardContent({ children, className = '' }) {
    return (
        <div className={`px-6 py-4 ${className}`}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className = '' }) {
    return (
        <h3 className={`text-lg font-semibold text-clinical-gray-900 ${className}`}>
            {children}
        </h3>
    );
}
