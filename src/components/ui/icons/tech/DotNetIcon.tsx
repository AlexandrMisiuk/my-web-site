import type { IconProps } from '../index';

export function DotNetIcon({ size = 24, className, ...props }: IconProps) {
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
            <rect width="24" height="24" rx="5" fill="#512BD4" />
            <path
                d="M4.8 14.5a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4zm3-5.2h1.6l2.8 4.2V9.3h1.4v6H12L9.2 11v4.3H7.8V9.3zm8 0h3.8v1.2h-2.4v1.2h2v1.2h-2v1.2h2.5v1.2h-3.9V9.3z"
                fill="#FFFFFF"
            />
        </svg>
    );
}
