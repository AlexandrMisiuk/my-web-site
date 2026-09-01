import type { IconProps } from '../index';

export function NodeJsIcon({ size = 24, className, ...props }: IconProps) {
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
            <polygon points="12,2 21.5,7.5 21.5,16.5 12,22 2.5,16.5 2.5,7.5" fill="#339933" />
            <path
                d="M12 6.5l5.5 3.2v6.4L12 19.3l-5.5-3.2V9.7L12 6.5zm-2.2 8.3v-4.5l3.8 2.2v4.5l-3.8-2.2z"
                fill="#FFFFFF"
                opacity="0.95"
            />
        </svg>
    );
}
