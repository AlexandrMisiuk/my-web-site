import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { mockMatchMedia, setMediaMatches } from '@/test/matchMedia';
import { THEME_STORAGE_KEY, useColorScheme } from './useColorScheme';

describe('useColorScheme', () => {
    it('resolves dark from a pre-seeded sessionStorage entry', () => {
        sessionStorage.setItem(THEME_STORAGE_KEY, 'dark');

        const { result } = renderHook(() => useColorScheme());

        expect(result.current.theme).toBe('dark');
        expect(result.current.isDark).toBe(true);
    });

    it('falls back to the data-theme attribute when storage is empty', () => {
        document.documentElement.setAttribute('data-theme', 'dark');

        const { result } = renderHook(() => useColorScheme());

        expect(result.current.theme).toBe('dark');
    });

    it('falls back to prefers-color-scheme when storage and the attribute are absent', () => {
        mockMatchMedia({ '(prefers-color-scheme: dark)': true });

        const { result } = renderHook(() => useColorScheme());

        expect(result.current.theme).toBe('dark');
    });

    it('defaults to light when no preference is available', () => {
        const { result } = renderHook(() => useColorScheme());

        expect(result.current.theme).toBe('light');
        expect(result.current.isDark).toBe(false);
    });

    it('writes the theme attribute and sessionStorage on setTheme and inverts on toggle', () => {
        const { result } = renderHook(() => useColorScheme());

        act(() => {
            result.current.setTheme('dark');
        });

        expect(result.current.theme).toBe('dark');
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        expect(sessionStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');

        act(() => {
            result.current.toggle();
        });

        expect(result.current.theme).toBe('light');
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
        expect(sessionStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    });

    it('applies an OS preference change when no session override exists', () => {
        const { result } = renderHook(() => useColorScheme());

        act(() => {
            setMediaMatches('(prefers-color-scheme: dark)', true);
        });

        expect(result.current.theme).toBe('dark');
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('ignores an OS preference change when a session override exists', () => {
        sessionStorage.setItem(THEME_STORAGE_KEY, 'light');
        const { result } = renderHook(() => useColorScheme());

        act(() => {
            setMediaMatches('(prefers-color-scheme: dark)', true);
        });

        expect(result.current.theme).toBe('light');
        expect(document.documentElement.getAttribute('data-theme')).not.toBe('dark');
    });

    it('does not crash when sessionStorage throws (private mode)', () => {
        const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new Error('Access denied');
        });
        const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('Access denied');
        });

        try {
            mockMatchMedia({ '(prefers-color-scheme: dark)': true });
            const { result } = renderHook(() => useColorScheme());

            expect(result.current.theme).toBe('dark');

            act(() => {
                result.current.setTheme('light');
            });

            expect(result.current.theme).toBe('light');
            expect(document.documentElement.getAttribute('data-theme')).toBe('light');

            act(() => {
                setMediaMatches('(prefers-color-scheme: dark)', false);
            });

            expect(result.current.theme).toBe('light');
        } finally {
            getItem.mockRestore();
            setItem.mockRestore();
        }
    });
});
