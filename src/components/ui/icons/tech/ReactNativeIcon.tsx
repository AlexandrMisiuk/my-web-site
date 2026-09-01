import type { IconProps } from '../index';

export function ReactNativeIcon({ size = 24, className, ...props }: IconProps) {
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
            <circle cx="12" cy="12" r="2.2" fill="#61DAFB" />
            <ellipse cx="12" cy="12" rx="9.5" ry="3.8" stroke="#61DAFB" strokeWidth="1.4" />
            <ellipse
                cx="12"
                cy="12"
                rx="9.5"
                ry="3.8"
                stroke="#61DAFB"
                strokeWidth="1.4"
                transform="rotate(60 12 12)"
            />
            <ellipse
                cx="12"
                cy="12"
                rx="9.5"
                ry="3.8"
                stroke="#61DAFB"
                strokeWidth="1.4"
                transform="rotate(120 12 12)"
            />
        </svg>
    );
}
