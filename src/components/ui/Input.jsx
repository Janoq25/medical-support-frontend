import React from 'react';

export default function Input({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    icon: Icon,
    className = '',
    ...props
}) {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {label && (
                <label className="text-sm font-bold text-sage-700 ml-1">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-400">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full px-5 py-3 border border-sage-200 bg-white/15 backdrop-blur-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-sage-400 text-sage-900 placeholder:text-sage-600 transition-all duration-200 shadow-sm ${Icon ? 'pl-11' : ''
                        }`}
                    {...props}
                />
            </div>
        </div>
    );
}

export function Textarea({
    label,
    value,
    onChange,
    placeholder,
    rows = 4,
    className = '',
    ...props
}) {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {label && (
                <label className="text-sm font-bold text-sage-700 ml-1">
                    {label}
                </label>
            )}
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className="w-full px-5 py-3 border border-sage-200 bg-white/15 backdrop-blur-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-sage-400 text-sage-900 placeholder:text-sage-600 transition-all duration-200 resize-none shadow-sm"
                {...props}
            />
        </div>
    );
}
