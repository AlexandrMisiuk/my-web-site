import type { IconProps } from '../index';

export function NgrxIcon({ size = 24, className, ...props }: IconProps) {
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
            <polygon points="12,2 21.5,5.4 19.9,17.4 12,22 4.1,17.4 2.5,5.4" fill="#BA68C8" />
            <polygon points="12,2 12,22 19.9,17.4 21.5,5.4" fill="#8E24AA" />
            <path d="M7.5 17.5V6.5h2.2l4.8 6.8V6.5h2v11h-2.2L9.5 10.7v6.8H7.5z" fill="#FFFFFF" />
        </svg>
    );
}
