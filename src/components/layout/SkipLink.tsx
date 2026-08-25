import React from 'react';

export interface SkipLinkProps {
    targetId?: string;
    children?: React.ReactNode;
    className?: string;
}

export function SkipLink({ targetId = 'main', children = 'Skip to main content', className = '' }: SkipLinkProps) {
    return (
        <a
            href={`#${targetId}`}
            className={`focus:bg-accent focus:text-body focus-visible:outline-accent sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:inline-flex focus:items-center focus:rounded-[var(--radius-sm)] focus:px-4 focus:py-2.5 focus:font-mono focus:font-medium focus:text-white focus:shadow-md focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`.trim()}
        >
            {children}
        </a>
    );
}
