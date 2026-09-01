import type { IconProps } from '../index';

export function AngularMaterialIcon({ size = 24, className, ...props }: IconProps) {
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
            <polygon points="12,2 21.5,5.4 19.9,17.4 12,22 4.1,17.4 2.5,5.4" fill="#3F51B5" />
            <polygon points="12,2 12,22 19.9,17.4 21.5,5.4" fill="#303F9F" />
            <polygon points="12,6.5 17.5,17.5 14.5,17.5 12,12.5 9.5,17.5 6.5,17.5" fill="#FFC107" />
        </svg>
    );
}
