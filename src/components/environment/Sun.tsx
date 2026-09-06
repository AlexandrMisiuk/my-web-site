import { ENV } from './environment.constants';

/**
 * The sun is positioned in viewport-relative terms rather than inside the
 * scene viewBox: `slice` cropping on tall, narrow viewports would otherwise
 * push this focal element off-screen.
 */
export function Sun() {
    return (
        <div data-env={ENV.sunGroup} className="absolute top-[13%] right-[9%] aspect-square w-[clamp(7rem,17vw,15rem)]">
            <svg viewBox="0 0 200 200" className="h-full w-full" focusable="false">
                <defs>
                    <radialGradient id="env-sun-glow-gradient">
                        <stop offset="18%" stopColor="#ffe9b0" stopOpacity="0.85" />
                        <stop offset="46%" stopColor="#ffd27a" stopOpacity="0.32" />
                        <stop offset="100%" stopColor="#ffbe63" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="env-sun-core-gradient">
                        <stop offset="0%" stopColor="#fffaf0" />
                        <stop offset="70%" stopColor="#ffe6a8" />
                        <stop offset="100%" stopColor="#ffcf72" />
                    </radialGradient>
                </defs>
                <circle data-env={ENV.sunGlow} cx="100" cy="100" r="100" fill="url(#env-sun-glow-gradient)" />
                <circle data-env={ENV.sunCore} cx="100" cy="100" r="38" fill="url(#env-sun-core-gradient)" />
            </svg>
        </div>
    );
}
