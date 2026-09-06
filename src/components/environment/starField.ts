import { ENV_VIEWBOX_WIDTH, STAR_FIELD_MAX_Y, STAR_FIELD_MIN_Y } from './environment.constants';
import { createRandom } from './random';

export interface Star {
    id: number;
    x: number;
    y: number;
    radius: number;
    opacity: number;
}

/** Deterministic star placement across the sky band of the viewBox. */
export function createStarField(count: number, seed: number): Star[] {
    const random = createRandom(seed);
    const span = STAR_FIELD_MAX_Y - STAR_FIELD_MIN_Y;

    return Array.from({ length: count }, (_, id) => ({
        id,
        x: Math.round(random() * ENV_VIEWBOX_WIDTH * 100) / 100,
        // Bias stars towards the upper sky so the horizon stays clean.
        y: Math.round((STAR_FIELD_MIN_Y + random() ** 1.4 * span) * 100) / 100,
        radius: Math.round((0.9 + random() * 1.7) * 100) / 100,
        opacity: Math.round((0.45 + random() * 0.55) * 100) / 100,
    }));
}
