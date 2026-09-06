import { ENV } from './environment.constants';

/** Positioned in viewport-relative terms for the same reason as the sun. */
export function Moon() {
    return (
        <div
            data-env={ENV.moonGroup}
            className="env-night-layer absolute top-[11%] right-[11%] aspect-square w-[clamp(6rem,14vw,12rem)]"
        >
            <svg viewBox="0 0 200 200" className="h-full w-full" focusable="false">
                <defs>
                    <radialGradient id="env-moon-halo-gradient">
                        <stop offset="22%" stopColor="#c9d4f5" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#c9d4f5" stopOpacity="0" />
                    </radialGradient>
                    {/* Crescent: an offset disc masked out of the moon face. */}
                    <mask id="env-moon-mask">
                        <rect x="0" y="0" width="200" height="200" fill="#000" />
                        <circle cx="100" cy="100" r="44" fill="#fff" />
                        <circle cx="78" cy="86" r="38" fill="#000" />
                    </mask>
                </defs>
                <circle cx="100" cy="100" r="100" fill="url(#env-moon-halo-gradient)" />
                <circle cx="100" cy="100" r="44" fill="#e6ebfa" mask="url(#env-moon-mask)" />
            </svg>
        </div>
    );
}
