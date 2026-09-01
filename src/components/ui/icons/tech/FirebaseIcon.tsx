import type { IconProps } from '../index';

export function FirebaseIcon({ size = 24, className, ...props }: IconProps) {
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
            <polygon points="4.2,16.8 6.4,3.2 9.8,9.5" fill="#FFA000" />
            <polygon points="4.2,16.8 12.0,21.5 9.8,9.5" fill="#F57C00" />
            <polygon points="19.8,16.8 17.2,7.5 9.8,9.5" fill="#FFCA28" />
            <polygon points="19.8,16.8 12.0,21.5 9.8,9.5" fill="#FFA000" />
        </svg>
    );
}
