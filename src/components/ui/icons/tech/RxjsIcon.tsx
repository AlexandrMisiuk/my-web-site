import type { IconProps } from '../index';

export function RxjsIcon({ size = 24, className, ...props }: IconProps) {
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
            <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.2 15.6c-2.4 0-4.2-1.2-4.8-3.1h2.2c.4.9 1.4 1.4 2.6 1.4 1.6 0 2.7-.9 2.7-2.1 0-1.1-.7-1.8-2.5-2.2l-1.3-.3c-2.3-.5-3.5-1.7-3.5-3.5 0-2.2 1.8-3.7 4.5-3.7 2.1 0 3.8 1 4.4 2.7h-2.2c-.4-.7-1.2-1.1-2.2-1.1-1.4 0-2.3.8-2.3 1.9 0 1 .8 1.6 2.3 1.9l1.4.3c2.5.6 3.8 1.8 3.8 3.7 0 2.4-1.9 4.1-4.8 4.1z"
                fill="#D80073"
            />
            <circle cx="17.5" cy="6.5" r="2.5" fill="#FF4081" />
        </svg>
    );
}
