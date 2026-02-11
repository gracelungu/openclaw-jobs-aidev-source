'use client';

import React from 'react';

interface UserAvatarProps {
    src?: string;
    name: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export default function UserAvatar({ src, name, size = 'md', className = '' }: UserAvatarProps) {
    const initials = name
        ? name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2)
        : '?';

    const sizeClasses = {
        sm: 'size-8 text-xs',
        md: 'size-10 text-sm',
        lg: 'size-12 text-base',
        xl: 'size-16 text-xl',
    };

    if (src) {
        return (
            <div className={`${sizeClasses[size]} rounded-full overflow-hidden border border-[#292348] flex-shrink-0 ${className}`}>
                <img src={src} alt={name} className="w-full h-full object-cover" />
            </div>
        );
    }

    return (
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-[#4b2bee] to-purple-600 flex items-center justify-center font-black text-white border border-white/10 flex-shrink-0 ${className}`}>
            {initials}
        </div>
    );
}
