import { describe, expect, it } from 'vitest';
import { createRandom } from './random';

describe('createRandom', () => {
    it('returns values in the [0, 1) range', () => {
        const next = createRandom(1);

        for (let i = 0; i < 50; i += 1) {
            const value = next();
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThan(1);
        }
    });

    it('is deterministic for a given seed', () => {
        const first = createRandom(4242);
        const second = createRandom(4242);

        expect([first(), first(), first()]).toEqual([second(), second(), second()]);
    });

    it('diverges for different seeds', () => {
        const first = createRandom(1);
        const second = createRandom(2);

        expect(first()).not.toEqual(second());
    });
});
