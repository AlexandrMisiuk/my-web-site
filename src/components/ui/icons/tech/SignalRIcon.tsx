import type { IconProps } from '../index';

export function SignalRIcon({ size = 24, className, ...props }: IconProps) {
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
            <circle cx="12" cy="18" r="2.5" fill="#512BD4" />
            <path
                d="M7.8 13.8a6 6 0 0 1 8.4 0M4.9 10.9a10 10 0 0 1 14.2 0M2.1 8.1a14 14 0 0 1 19.8 0"
                stroke="#512BD4"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}
