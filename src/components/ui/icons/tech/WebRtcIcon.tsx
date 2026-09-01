import type { IconProps } from '../index';

export function WebRtcIcon({ size = 24, className, ...props }: IconProps) {
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
            <circle cx="12" cy="6" r="3" fill="#3369E8" />
            <circle cx="6" cy="17" r="3" fill="#009688" />
            <circle cx="18" cy="17" r="3" fill="#FF7043" />
            <line x1="12" y1="9" x2="6" y2="14" stroke="#3369E8" strokeWidth="1.8" />
            <line x1="12" y1="9" x2="18" y2="14" stroke="#FF7043" strokeWidth="1.8" />
            <line x1="9" y1="17" x2="15" y2="17" stroke="#009688" strokeWidth="1.8" strokeDasharray="2 2" />
        </svg>
    );
}
