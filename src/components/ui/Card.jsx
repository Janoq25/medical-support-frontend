import React from 'react';

export default function Card({ children, className = '', hover = false, ...props }) {
    return (
        <div
            className={`card-biophilic ${hover ? 'transition-soft hover:shadow-soft hover:-translate-y-1' : ''
                } ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }) {
    return (
        <div className={`px-8 py-6 border-b border-sage-100/50 ${className}`}>
            {children}
        </div>
    );
}

export function CardContent({ children, className = '' }) {
    return (
        <div className={`px-8 py-6 ${className}`}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className = '' }) {
    return (
        <h3 className={`text-xl font-bold text-sage-900 tracking-tight ${className}`}>
            {children}
        </h3>
    );
}
