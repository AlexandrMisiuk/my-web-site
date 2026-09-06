import { BLADE_BASE_Y, ENV_VIEWBOX_WIDTH } from './environment.constants';
import { createRandom } from './random';

export interface Blade {
    id: number;
    x: number;
    baseY: number;
    height: number;
    lean: number;
}

/** Deterministic grass placement along the front edge of the field. */
export function createBladeField(count: number, seed: number): Blade[] {
    const random = createRandom(seed);

    return Array.from({ length: count }, (_, id) => ({
        id,
        x: Math.round(((id + random()) / Math.max(count, 1)) * ENV_VIEWBOX_WIDTH * 100) / 100,
        baseY: Math.round((BLADE_BASE_Y + random() * 14) * 100) / 100,
        height: Math.round((13 + random() * 21) * 100) / 100,
        lean: Math.round((random() * 26 - 13) * 100) / 100,
    }));
}
