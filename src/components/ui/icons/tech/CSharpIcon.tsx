import type { IconProps } from '../index';

export function CSharpIcon({ size = 24, className, ...props }: IconProps) {
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
            <polygon points="12,2 21.5,7.5 21.5,16.5 12,22 2.5,16.5 2.5,7.5" fill="#9B4F96" />
            <path
                d="M11.5 8.5c-2.2 0-3.8 1.5-3.8 3.5s1.6 3.5 3.8 3.5c1.2 0 2.2-.5 2.8-1.2l-1.1-.9c-.4.5-1 .8-1.7.8-1.3 0-2.3-.9-2.3-2.2s1-2.2 2.3-2.2c.7 0 1.3.3 1.7.8l1.1-.9c-.6-.7-1.6-1.2-2.8-1.2zm5.2 2.3v1.1h1.1v.8h-1.1v1.1h-.8v-1.1h-1.1v-.8h1.1v-1.1h.8z"
                fill="#FFFFFF"
            />
        </svg>
    );
}
