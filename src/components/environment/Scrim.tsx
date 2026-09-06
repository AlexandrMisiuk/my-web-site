import { ENV } from './environment.constants';

/**
 * Contrast control. The base scrim keeps body copy readable over the field in
 * daylight; the night scrim deepens it as the scene darkens.
 */
export function Scrim() {
    return (
        <>
            <div className="env-scrim-base absolute inset-0" />
            <div data-env={ENV.scrimNight} className="env-scrim-night env-night-layer absolute inset-0" />
        </>
    );
}
