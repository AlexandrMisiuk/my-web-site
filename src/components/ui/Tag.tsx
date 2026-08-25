import React from 'react';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
    children: React.ReactNode;
    className?: string;
}

export function Tag({ children, className = '', ...props }: TagProps) {
    return (
        <span
            className={`border-hairline bg-surface text-mono-xs text-ink-muted inline-flex items-center rounded-[var(--radius-sm)] border px-2.5 py-1 font-mono tracking-wider uppercase ${className}`}
            {...props}
        >
            {children}
        </span>
    );
}
