/**
 * Geometry, timing and DOM hooks for the animated environment.
 *
 * The scene is authored in a fixed 1600x900 user-space viewBox and scaled with
 * `preserveAspectRatio="xMidYMax slice"`, so the horizon is always pinned to the
 * bottom edge and no JavaScript measurement is ever required.
 */

export const ENV_VIEWBOX_WIDTH = 1600;
export const ENV_VIEWBOX_HEIGHT = 900;

/** Sky band the stars may occupy — comfortably above the furthest hill ridge. */
export const STAR_FIELD_MIN_Y = 24;
export const STAR_FIELD_MAX_Y = 540;

export const STAR_COUNT = 64;
export const STAR_SEED = 20260906;

export const BLADE_COUNT = 52;
export const BLADE_SEED = 1312;
export const BLADE_BASE_Y = 884;

/**
 * Master arc, in viewport units.
 *
 * The sun and moon live in viewport-relative DOM boxes rather than in the scene
 * viewBox, so `slice` cropping can never carry them off-screen. The ridge line
 * sits at 72% of the viewport height whenever height drives the scale, so a 68vh
 * fall from a 13% start reliably puts the sun behind the hills.
 */
export const SUN_SET_TRAVEL = '68vh';
export const SUN_SET_DRIFT = '-4vw';
export const MOON_RISE_TRAVEL = '6vh';
export const CLOUD_NIGHT_OPACITY = 0.22;
export const SUN_GLOW_BASE_OPACITY = 0.55;

/** Wall-clock length of a full sunset (and, reversed, a full sunrise). */
export const DAY_NIGHT_DURATION = 3.2;

/**
 * Cloud drift is expressed in viewBox units so no layout is read per frame.
 *
 * `slice` scaling always leaves the visible x-range a subset of 0..1600 (when
 * width drives the scale there is no horizontal crop at all), so a cloud parked
 * one margin beyond either edge is off-screen at every viewport. The margin
 * only has to clear the widest cloud's half-width (~133 units at scale 1.25).
 */
export const CLOUD_WRAP_MARGIN = 200;
export const CLOUD_WRAP_SPAN = ENV_VIEWBOX_WIDTH + 2 * CLOUD_WRAP_MARGIN;
export const CLOUD_BASE_DURATION = 78;
export const CLOUD_DURATION_STEP = 14;

export const ENV = {
    layer: 'layer',
    skyDay: 'sky-day',
    skyDusk: 'sky-dusk',
    skyNight: 'sky-night',
    starField: 'star-field',
    star: 'star',
    sunGroup: 'sun-group',
    sunCore: 'sun-core',
    sunGlow: 'sun-glow',
    moonGroup: 'moon-group',
    cloudBand: 'cloud-band',
    cloud: 'cloud',
    fieldNight: 'field-night',
    blade: 'blade',
    scrimNight: 'scrim-night',
} as const;

export function envSelector(part: string): string {
    return `[data-env="${part}"]`;
}

/**
 * How much ambient motion a viewport can afford. Only the animation budget
 * changes across breakpoints — the rendered markup is identical everywhere, so
 * responsiveness never costs a React re-render.
 */
export interface AmbientBudget {
    twinklingStars: number;
    swayingBlades: number;
    cloudDurationScale: number;
}

export const AMBIENT_DESKTOP: AmbientBudget = {
    twinklingStars: 40,
    swayingBlades: BLADE_COUNT,
    cloudDurationScale: 1,
};

export const AMBIENT_MOBILE: AmbientBudget = {
    twinklingStars: 14,
    swayingBlades: 0,
    cloudDurationScale: 1.6,
};
