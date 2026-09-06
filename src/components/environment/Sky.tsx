import { ENV } from './environment.constants';

/**
 * Three stacked gradient layers cross-faded on opacity alone.
 *
 * Animating gradient stops would repaint every frame; opacity between static
 * layers stays on the compositor. The dusk layer is what makes the theme
 * change read as a sunset rather than a straight cross-fade.
 */
export function Sky() {
    return (
        <>
            <div data-env={ENV.skyDay} className="env-sky-day absolute inset-0" />
            <div data-env={ENV.skyDusk} className="env-sky-dusk env-night-layer absolute inset-0" />
            <div data-env={ENV.skyNight} className="env-sky-night env-night-layer absolute inset-0" />
        </>
    );
}
