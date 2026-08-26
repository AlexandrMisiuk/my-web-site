import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SECTION_IDS } from '@/data/navigation';
import {
    emitIntersections,
    getObservedIds,
    getObserverOptions,
    wasObserverDisconnected,
} from '@/test/intersectionObserver';
import { useActiveSection } from './useActiveSection';

function mountSections(ids: readonly string[]): void {
    ids.forEach((id) => {
        const section = document.createElement('section');
        section.id = id;
        document.body.append(section);
    });
}

function stubViewport({
    scrollY,
    innerHeight,
    scrollHeight,
}: {
    scrollY: number;
    innerHeight: number;
    scrollHeight: number;
}): void {
    Object.defineProperty(window, 'scrollY', { configurable: true, value: scrollY });
    Object.defineProperty(window, 'pageYOffset', { configurable: true, value: scrollY });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: innerHeight });
    Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: scrollHeight });
}

afterEach(() => {
    document.documentElement.style.removeProperty('--header-height');
    document.body.replaceChildren();
});

describe('useActiveSection', () => {
    it('observes every resolvable SECTION_IDS element and skips missing ids', () => {
        mountSections(['hero', 'work', 'contact']);

        const { result } = renderHook(() => useActiveSection(SECTION_IDS));

        expect(result.current).toBe('hero');
        expect(getObservedIds()).toEqual(['hero', 'work', 'contact']);
    });

    it('derives rootMargin from a rem-valued --header-height', () => {
        document.documentElement.style.fontSize = '16px';
        document.documentElement.style.setProperty('--header-height', '4.5rem');
        mountSections(['hero']);

        renderHook(() => useActiveSection(['hero']));

        expect(getObserverOptions()?.rootMargin).toBe('-72px 0px -55% 0px');
    });

    it('falls back to a 16px root font size when computed font-size is empty', () => {
        mountSections(['hero']);
        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
            getPropertyValue: () => '3rem',
            fontSize: '',
        } as unknown as CSSStyleDeclaration);

        renderHook(() => useActiveSection(['hero']));

        expect(getObserverOptions()?.rootMargin).toBe('-48px 0px -55% 0px');
        vi.restoreAllMocks();
    });

    it('derives rootMargin from a px-valued --header-height', () => {
        document.documentElement.style.setProperty('--header-height', '80px');
        mountSections(['hero']);

        renderHook(() => useActiveSection(['hero']));

        expect(getObserverOptions()?.rootMargin).toBe('-80px 0px -55% 0px');
    });

    it('falls back to -64px when --header-height is unset, invalid, or non-positive', () => {
        mountSections(['hero']);
        renderHook(() => useActiveSection(['hero']));
        expect(getObserverOptions()?.rootMargin).toBe('-64px 0px -55% 0px');

        document.documentElement.style.setProperty('--header-height', 'nope');
        renderHook(() => useActiveSection(['hero']));
        expect(getObserverOptions()?.rootMargin).toBe('-64px 0px -55% 0px');

        document.documentElement.style.setProperty('--header-height', '0px');
        renderHook(() => useActiveSection(['hero']));
        expect(getObserverOptions()?.rootMargin).toBe('-64px 0px -55% 0px');

        document.documentElement.style.setProperty('--header-height', 'rem');
        renderHook(() => useActiveSection(['hero']));
        expect(getObserverOptions()?.rootMargin).toBe('-64px 0px -55% 0px');
    });

    it('selects the first intersecting id in document order', () => {
        const ids = ['hero', 'work', 'about'] as const;
        mountSections(ids);
        const { result } = renderHook(() => useActiveSection(ids));

        act(() => {
            emitIntersections([
                { id: 'about', isIntersecting: true },
                { id: 'work', isIntersecting: true },
            ]);
        });

        expect(result.current).toBe('work');
    });

    it('selects the first id when nothing intersects near the top of the page', () => {
        const ids = ['hero', 'work', 'contact'] as const;
        mountSections(ids);
        stubViewport({ scrollY: 20, innerHeight: 800, scrollHeight: 4000 });
        const { result } = renderHook(() => useActiveSection(ids));

        act(() => {
            emitIntersections([{ id: 'work', isIntersecting: true }]);
        });
        act(() => {
            emitIntersections([{ id: 'work', isIntersecting: false }]);
        });

        expect(result.current).toBe('hero');
    });

    it('treats a fully unset scroll offset as the top of the page', () => {
        const ids = ['hero', 'work', 'contact'] as const;
        mountSections(ids);
        Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
        Object.defineProperty(window, 'pageYOffset', { configurable: true, value: 0 });
        Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
        Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 4000 });
        const { result } = renderHook(() => useActiveSection(ids));

        act(() => {
            emitIntersections([{ id: 'work', isIntersecting: true }]);
        });
        act(() => {
            emitIntersections([{ id: 'work', isIntersecting: false }]);
        });

        expect(result.current).toBe('hero');
    });

    it('uses pageYOffset when scrollY is zero', () => {
        const ids = ['hero', 'work', 'contact'] as const;
        mountSections(ids);
        Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
        Object.defineProperty(window, 'pageYOffset', { configurable: true, value: 20 });
        Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
        Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 4000 });
        const { result } = renderHook(() => useActiveSection(ids));

        act(() => {
            emitIntersections([{ id: 'work', isIntersecting: true }]);
        });
        act(() => {
            emitIntersections([{ id: 'work', isIntersecting: false }]);
        });

        expect(result.current).toBe('hero');
    });

    it('selects the last id when nothing intersects at the bottom of the page', () => {
        const ids = ['hero', 'work', 'contact'] as const;
        mountSections(ids);
        stubViewport({ scrollY: 500, innerHeight: 800, scrollHeight: 1300 });
        const { result } = renderHook(() => useActiveSection(ids));

        act(() => {
            emitIntersections([{ id: 'work', isIntersecting: true }]);
        });
        act(() => {
            emitIntersections([{ id: 'work', isIntersecting: false }]);
        });

        expect(result.current).toBe('contact');
    });

    it('keeps the previous id when the page is mid-scroll with nothing intersecting', () => {
        const ids = ['hero', 'work', 'contact'] as const;
        mountSections(ids);
        stubViewport({ scrollY: 400, innerHeight: 800, scrollHeight: 4000 });
        const { result } = renderHook(() => useActiveSection(ids));

        act(() => {
            emitIntersections([{ id: 'work', isIntersecting: true }]);
        });
        act(() => {
            emitIntersections([{ id: 'work', isIntersecting: false }]);
        });

        expect(result.current).toBe('work');
    });

    it('returns an empty string and skips the observer when no ids are provided', () => {
        const { result } = renderHook(() => useActiveSection([]));

        expect(result.current).toBe('');
        expect(getObserverOptions()).toBeUndefined();
    });

    it('disconnects the observer and clears observed ids on unmount', () => {
        mountSections(['hero', 'work']);
        const { unmount } = renderHook(() => useActiveSection(['hero', 'work']));

        unmount();

        expect(wasObserverDisconnected()).toBe(true);
        expect(getObservedIds()).toEqual([]);
    });
});
