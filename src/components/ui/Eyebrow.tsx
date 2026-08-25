import React from 'react';

export interface EyebrowProps {
    children: React.ReactNode;
    as?: 'p' | 'span' | 'div' | 'h2' | 'h3';
    className?: string;
}

export function Eyebrow({ children, as: Component = 'p', className = '', ...props }: EyebrowProps) {
    return (
        <Component
            className={`text-mono-xs text-ink-muted font-mono font-medium tracking-[0.08em] uppercase ${className}`}
            {...props}
        >
            {children}
        </Component>
    );
}
