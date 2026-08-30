import React from 'react';

export interface ContainerProps {
    as?: 'div' | 'header' | 'footer' | 'nav' | 'section';
    grid?: boolean;
    className?: string;
    children: React.ReactNode;
}

export function Container({ as: Component = 'div', grid = false, className = '', children }: ContainerProps) {
    const gridClasses = grid ? 'lg:grid lg:grid-cols-12 lg:gap-x-6 xl:gap-x-8' : '';

    return (
        <Component className={`mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 xl:px-16 ${gridClasses} ${className}`.trim()}>
            {children}
        </Component>
    );
}
