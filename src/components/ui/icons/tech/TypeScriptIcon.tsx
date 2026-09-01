import type { IconProps } from '../index';

export function TypeScriptIcon({ size = 24, className, ...props }: IconProps) {
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
            <rect width="24" height="24" rx="4" fill="#3178C6" />
            <path
                d="M4.5 10.5h6v1.8H8.4V19H6.6v-6.7H4.5v-1.8zm8 5.7c.6.4 1.3.7 2 .7.8 0 1.2-.3 1.2-.8 0-.5-.4-.7-1.4-1.1-1.4-.5-2.3-1.2-2.3-2.4 0-1.4 1.1-2.4 2.8-2.4 1 0 1.8.3 2.4.7l-.6 1.6c-.5-.3-1.1-.6-1.8-.6-.7 0-1.1.3-1.1.7 0 .4.4.6 1.4 1 1.5.5 2.3 1.2 2.3 2.5 0 1.5-1.1 2.5-3 2.5-1.1 0-2.1-.4-2.8-.9l.7-1.5z"
                fill="#FFFFFF"
            />
        </svg>
    );
}
