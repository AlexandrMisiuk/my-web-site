import type { IconProps } from '../index';

export function FlutterIcon({ size = 24, className, ...props }: IconProps) {
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
            <polygon points="13.8,2.5 5.5,10.8 8.6,13.9 19.9,2.5" fill="#47C5FB" />
            <polygon points="8.6,13.9 12.8,18.1 19.9,11.0 15.7,11.0" fill="#02569B" />
            <polygon points="12.8,18.1 16.2,21.5 20.3,21.5 16.9,18.1" fill="#0175C2" />
            <polygon points="16.9,18.1 12.8,18.1 15.7,15.2 18.3,16.7" fill="#02569B" />
            <polygon points="12.8,18.1 15.7,15.2 19.9,19.4 17.0,22.3" fill="#00B4AB" opacity="0.4" />
        </svg>
    );
}
