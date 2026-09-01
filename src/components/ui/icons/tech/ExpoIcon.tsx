import type { IconProps } from '../index';

export function ExpoIcon({ size = 24, className, ...props }: IconProps) {
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
            <path d="M3 17.5L9.5 6.5l3.2 5.5-2.2 3.8h8L21 17.5H3zm13.5-7.5l-2-3.5h5l-1.5 2.5-1.5 1z" fill="#FFFFFF" />
        </svg>
    );
}
