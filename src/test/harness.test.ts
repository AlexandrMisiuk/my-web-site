import { describe, expect, it, vi } from 'vitest';
import { emitIntersections, getObservedIds, getObserverOptions, wasObserverDisconnected } from './intersectionObserver';
import { setMediaMatches } from './matchMedia';

describe('browser API doubles', () => {
    it('drives matchMedia change events', () => {
        const listener = vi.fn();
        const media = window.matchMedia('(prefers-color-scheme: dark)');

        expect(media.matches).toBe(false);
        media.addEventListener('change', listener);

        setMediaMatches('(prefers-color-scheme: dark)', true);

        expect(media.matches).toBe(true);
        expect(listener).toHaveBeenCalledOnce();
        expect(listener.mock.calls[0][0]).toMatchObject({
            matches: true,
            media: '(prefers-color-scheme: dark)',
        });
    });

    it('records IntersectionObserver options and emitted entries', () => {
        const callback = vi.fn();
        const target = document.createElement('section');
        target.id = 'hero';
        document.body.append(target);

        const observer = new IntersectionObserver(callback, {
            rootMargin: '-64px 0px -55% 0px',
            threshold: [0, 0.1],
        });
        observer.observe(target);

        expect(getObservedIds()).toEqual(['hero']);
        expect(getObserverOptions()).toEqual({
            rootMargin: '-64px 0px -55% 0px',
            threshold: [0, 0.1],
        });

        emitIntersections([{ id: 'hero', isIntersecting: true }]);

        expect(callback).toHaveBeenCalledOnce();
        const [entries] = callback.mock.calls[0] as [IntersectionObserverEntry[]];
        expect(entries).toHaveLength(1);
        expect(entries[0]?.target).toBe(target);
        expect(entries[0]?.isIntersecting).toBe(true);

        observer.disconnect();
        expect(wasObserverDisconnected()).toBe(true);
        target.remove();
    });
});
