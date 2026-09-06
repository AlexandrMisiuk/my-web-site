import { ENV, SUN_CORE_RADIUS, SUN_GLOW_RADIUS, SUN_VIEWBOX } from './environment.constants';

const CENTRE = SUN_VIEWBOX / 2;

/**
 * The sun is positioned in viewport-relative terms rather than inside the
 * scene viewBox: `slice` cropping on tall, narrow viewports would otherwise
 * push this focal element off-screen.
 *
 * Gradient stops are expressed as a fraction of the glow radius, so the falloff
 * reaches fully transparent exactly at the circle's edge — the glow has no
 * boundary to show, however far it is scaled up.
 */
export function Sun() {
    return (
        <div data-env={ENV.sunGroup} className="absolute top-[13%] right-[9%] aspect-square w-[clamp(7rem,17vw,15rem)]">
            <svg viewBox={`0 0 ${SUN_VIEWBOX} ${SUN_VIEWBOX}`} className="h-full w-full" focusable="false">
                <defs>
                    <radialGradient id="env-sun-glow-gradient">
                        <stop offset="23%" stopColor="#ffe9b0" stopOpacity="0.85" />
                        <stop offset="59%" stopColor="#ffd27a" stopOpacity="0.32" />
                        <stop offset="100%" stopColor="#ffbe63" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="env-sun-core-gradient">
                        <stop offset="0%" stopColor="#fffaf0" />
                        <stop offset="70%" stopColor="#ffe6a8" />
                        <stop offset="100%" stopColor="#ffcf72" />
                    </radialGradient>
                </defs>
                <circle
                    data-env={ENV.sunGlow}
                    cx={CENTRE}
                    cy={CENTRE}
                    r={SUN_GLOW_RADIUS}
                    fill="url(#env-sun-glow-gradient)"
                />
                <circle
                    data-env={ENV.sunCore}
                    cx={CENTRE}
                    cy={CENTRE}
                    r={SUN_CORE_RADIUS}
                    fill="url(#env-sun-core-gradient)"
                />
            </svg>
        </div>
    );
}
