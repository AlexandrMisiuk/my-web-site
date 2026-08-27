import React from 'react';

export type StatusPillColor = 'emerald' | 'amber' | 'accent' | 'muted';
export type StatusPillVariant = 'canvas' | 'surface';
export type StatusPillSize = 'sm' | 'md';

export interface StatusPillProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    color?: StatusPillColor;
    variant?: StatusPillVariant;
    size?: StatusPillSize;
    pulse?: boolean;
    className?: string;
}

const COLOR_CONFIG: Record<StatusPillColor, { dot: string; ping: string }> = {
    emerald: {
        dot: 'bg-emerald-500',
        ping: 'bg-emerald-400',
    },
    amber: {
        dot: 'bg-amber-500',
        ping: 'bg-amber-400',
    },
    accent: {
        dot: 'bg-accent',
        ping: 'bg-accent/75',
    },
    muted: {
        dot: 'bg-ink-muted',
        ping: 'bg-ink-muted/75',
    },
};

const VARIANT_CONFIG: Record<StatusPillVariant, string> = {
    canvas: 'bg-canvas',
    surface: 'bg-surface',
};

const SIZE_CONFIG: Record<StatusPillSize, string> = {
    sm: 'px-2.5 py-1',
    md: 'px-3 py-1.5',
};

export function StatusPill({
    children,
    color = 'emerald',
    variant = 'canvas',
    size = 'sm',
    pulse = false,
    className = '',
    ...props
}: StatusPillProps) {
    const colorStyle = COLOR_CONFIG[color];
    const variantStyle = VARIANT_CONFIG[variant];
    const sizeStyle = SIZE_CONFIG[size];

    return (
        <div
            className={`border-hairline text-mono-xs text-ink-muted inline-flex items-center gap-2 rounded-full border font-mono ${variantStyle} ${sizeStyle} ${className}`.trim()}
            {...props}
        >
            {pulse ? (
                <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span
                        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 motion-reduce:animate-none ${colorStyle.ping}`}
                    />
                    <span className={`relative inline-flex h-2 w-2 rounded-full ${colorStyle.dot}`} />
                </span>
            ) : (
                <span className={`h-1.5 w-1.5 rounded-full ${colorStyle.dot}`} aria-hidden="true" />
            )}
            <span>{children}</span>
        </div>
    );
}
