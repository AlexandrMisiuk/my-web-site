import { describe, expect, it } from 'vitest';
import { createStarField } from './starField';
import { ENV_VIEWBOX_WIDTH, STAR_FIELD_MAX_Y, STAR_FIELD_MIN_Y } from './environment.constants';

describe('createStarField', () => {
    it('produces the requested number of stars', () => {
        expect(createStarField(24, 7)).toHaveLength(24);
    });

    it('returns an empty field when no stars are requested', () => {
        expect(createStarField(0, 7)).toEqual([]);
    });

    it('is deterministic for a given seed', () => {
        expect(createStarField(12, 99)).toEqual(createStarField(12, 99));
    });

    it('produces a different field for a different seed', () => {
        expect(createStarField(12, 99)).not.toEqual(createStarField(12, 100));
    });

    it('assigns every star a unique id', () => {
        const ids = createStarField(20, 5).map((star) => star.id);

        expect(new Set(ids).size).toBe(20);
    });

    it('keeps every star inside the sky region of the viewBox', () => {
        for (const star of createStarField(60, 3)) {
            expect(star.x).toBeGreaterThanOrEqual(0);
            expect(star.x).toBeLessThanOrEqual(ENV_VIEWBOX_WIDTH);
            expect(star.y).toBeGreaterThanOrEqual(STAR_FIELD_MIN_Y);
            expect(star.y).toBeLessThanOrEqual(STAR_FIELD_MAX_Y);
            expect(star.radius).toBeGreaterThan(0);
            expect(star.opacity).toBeGreaterThan(0);
            expect(star.opacity).toBeLessThanOrEqual(1);
        }
    });
});
