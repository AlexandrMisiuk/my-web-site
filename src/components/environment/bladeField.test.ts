import { describe, expect, it } from 'vitest';
import { createBladeField } from './bladeField';
import { ENV_VIEWBOX_WIDTH } from './environment.constants';

describe('createBladeField', () => {
    it('produces the requested number of blades', () => {
        expect(createBladeField(18, 11)).toHaveLength(18);
    });

    it('returns an empty field when no blades are requested', () => {
        expect(createBladeField(0, 11)).toEqual([]);
    });

    it('is deterministic for a given seed', () => {
        expect(createBladeField(10, 21)).toEqual(createBladeField(10, 21));
    });

    it('produces a different field for a different seed', () => {
        expect(createBladeField(10, 21)).not.toEqual(createBladeField(10, 22));
    });

    it('spans the viewBox width with positive geometry', () => {
        for (const blade of createBladeField(30, 8)) {
            expect(blade.x).toBeGreaterThanOrEqual(0);
            expect(blade.x).toBeLessThanOrEqual(ENV_VIEWBOX_WIDTH);
            expect(blade.height).toBeGreaterThan(0);
            expect(blade.baseY).toBeGreaterThan(0);
        }
    });
});
