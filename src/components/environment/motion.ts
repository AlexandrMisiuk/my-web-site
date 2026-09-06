export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
export const NO_PREFERENCE_QUERY = '(prefers-reduced-motion: no-preference)';

/** Desktop and mobile ambient-motion conditions for `gsap.matchMedia()`. */
export const AMBIENT_CONDITIONS = {
    full: `${NO_PREFERENCE_QUERY} and (min-width: 768px)`,
    lite: `${NO_PREFERENCE_QUERY} and (max-width: 767px)`,
} as const;

export function prefersReducedMotion(): boolean {
    return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
