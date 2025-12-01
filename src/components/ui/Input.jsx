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
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-clinical-gray-700">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-clinical-gray-400">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full px-4 py-2.5 border border-clinical-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinical-blue-500 focus:border-transparent transition-all ${Icon ? 'pl-10' : ''
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
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-clinical-gray-700">
                    {label}
                </label>
            )}
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className="w-full px-4 py-2.5 border border-clinical-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinical-blue-500 focus:border-transparent transition-all resize-none"
                {...props}
            />
        </div>
    );
}
