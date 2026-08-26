import { describe, expect, it } from 'vitest';
import { navItems, principles, projects, SECTION_IDS, siteProfile, technologies } from '@/data';

describe('data contracts', () => {
    it('keeps navItems ids as a subset of SECTION_IDS and starts with hero', () => {
        const sectionIds: readonly string[] = SECTION_IDS;
        expect(sectionIds[0]).toBe('hero');
        expect(navItems.every((item) => sectionIds.includes(item.id))).toBe(true);
    });

    it('uses unique, zero-padded, sequential nav indices', () => {
        const indices = navItems.map((item) => item.index);
        expect(new Set(indices).size).toBe(indices.length);
        expect(indices).toEqual(indices.map((_, index) => String(index + 1).padStart(2, '0')));
    });

    it('never uses a literal # placeholder for a site link', () => {
        expect(Object.values(siteProfile.links).every((href) => href !== '#')).toBe(true);
    });

    it('requires non-zero width and height on every project media asset', () => {
        for (const project of projects) {
            if (!project.media) continue;
            expect(project.media.width).toBeGreaterThan(0);
            expect(project.media.height).toBeGreaterThan(0);
        }
    });

    it('gives every principle a unique, non-empty id', () => {
        const ids = principles.map((principle) => principle.id);
        expect(ids.every((id) => id.length > 0)).toBe(true);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('gives every technology a unique, non-empty label', () => {
        expect(technologies.every((technology) => technology.length > 0)).toBe(true);
        expect(new Set(technologies).size).toBe(technologies.length);
    });
});
