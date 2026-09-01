import React from 'react';
import { ArrowUpRightIcon } from './icons';

export interface ActionLinkProps {
    href?: string;
    children: React.ReactNode;
    variant?: 'primary' | 'ghost';
    isExternal?: boolean;
    download?: boolean | string;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
    type?: 'button' | 'submit' | 'reset';
    target?: string;
    rel?: string;
    'aria-label'?: string;
}

export function ActionLink({
    href,
    children,
    variant = 'primary',
    isExternal,
    download,
    className = '',
    onClick,
    type = 'button',
    target,
    rel,
    'aria-label': ariaLabel,
}: ActionLinkProps) {
    const isAutoExternal = Boolean(href && /^https?:\/\//i.test(href));
    const isExt = isExternal ?? isAutoExternal;

    const baseStyles =
        'group inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-sm)] px-5 py-2.5 text-body font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent cursor-pointer';

    const variantStyles =
        variant === 'primary'
            ? 'bg-accent text-white dark:text-canvas hover:bg-accent-hover shadow-xs'
            : 'border border-hairline bg-transparent text-ink hover:border-ink-muted hover:bg-surface';

    const combinedClasses = `${baseStyles} ${variantStyles} ${className}`.trim();

    if (href) {
        const resolvedTarget = target ?? (isExt ? '_blank' : undefined);
        const resolvedRel = rel ?? (isExt ? 'noopener noreferrer' : undefined);

        return (
            <a
                href={href}
                target={resolvedTarget}
                rel={resolvedRel}
                download={download}
                className={combinedClasses}
                onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
                aria-label={ariaLabel}
            >
                {children}
                {isExt && (
                    <>
                        <ArrowUpRightIcon
                            size={16}
                            className="shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                        <span className="sr-only">(opens in a new tab)</span>
                    </>
                )}
            </a>
        );
    }

    return (
        <button
            type={type}
            className={combinedClasses}
            onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
            aria-label={ariaLabel}
        >
            {children}
        </button>
    );
}
