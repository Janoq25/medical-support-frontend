'use client';
import { Loader2 } from 'lucide-react';

export const FullScreenLoader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
            <Loader2 className="animate-spin rounded-full h-8 w-8 text-blue-500" />
        </div>
    );
}