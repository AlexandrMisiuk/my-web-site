import type { IconProps } from '../index';

export function SqliteIcon({ size = 24, className, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className={className}
            {...props}
        >
            <rect width="24" height="24" rx="4" fill="#003B57" />
            <ellipse cx="12" cy="7" rx="6.5" ry="2.2" fill="#00A98F" />
            <path d="M5.5 7v4c0 1.2 2.9 2.2 6.5 2.2s6.5-1 6.5-2.2V7" stroke="#00A98F" strokeWidth="1.4" />
            <path d="M5.5 12v4c0 1.2 2.9 2.2 6.5 2.2s6.5-1 6.5-2.2v-4" stroke="#00A98F" strokeWidth="1.4" />
        </svg>
    );
}
