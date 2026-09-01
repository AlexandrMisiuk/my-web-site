import type { IconProps } from '../index';

export function DartIcon({ size = 24, className, ...props }: IconProps) {
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
            <polygon points="3.5,3.5 13.5,3.5 20.5,10.5 10.5,20.5 3.5,13.5" fill="#01579B" />
            <polygon points="3.5,3.5 13.5,3.5 9.5,7.5 3.5,7.5" fill="#0081C6" />
            <polygon points="9.5,7.5 17.5,7.5 20.5,10.5 12.5,10.5" fill="#40C4FF" />
            <polygon points="12.5,10.5 17.5,10.5 10.5,17.5 5.5,17.5" fill="#00B4AB" />
            <polygon points="5.5,17.5 10.5,17.5 7.5,20.5 3.5,20.5" fill="#00796B" />
            <polygon points="3.5,7.5 9.5,7.5 5.5,11.5 3.5,11.5" fill="#29B6F6" />
        </svg>
    );
}
