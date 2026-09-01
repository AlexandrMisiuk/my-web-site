import type { IconProps } from '../index';

export function AngularIcon({ size = 24, className, ...props }: IconProps) {
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
            <polygon points="12,2 21.5,5.4 19.9,17.4 12,22 4.1,17.4 2.5,5.4" fill="#E23237" />
            <polygon points="12,2 12,22 19.9,17.4 21.5,5.4" fill="#B52E31" />
            <polygon points="12,4.8 6.5,17.2 9,17.2 10.1,14.4 13.9,14.4 15,17.2 17.5,17.2" fill="#FFFFFF" />
            <polygon points="12,9.2 10.9,12.4 13.1,12.4" fill="#B52E31" />
        </svg>
    );
}
