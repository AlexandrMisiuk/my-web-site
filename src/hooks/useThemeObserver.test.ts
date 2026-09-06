import { describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { readThemeAttribute, useThemeObserver } from './useThemeObserver';

describe('readThemeAttribute', () => {
    it('reads dark from the document element', () => {
        document.documentElement.setAttribute('data-theme', 'dark');

        expect(readThemeAttribute()).toBe('dark');
    });

    it('falls back to light when the attribute is absent or unknown', () => {
        expect(readThemeAttribute()).toBe('light');

        document.documentElement.setAttribute('data-theme', 'sepia');

        expect(readThemeAttribute()).toBe('light');
    });
});

describe('useThemeObserver', () => {
    it('reports a theme change on the document element', async () => {
        const onChange = vi.fn();
        renderHook(() => useThemeObserver(onChange));

        document.documentElement.setAttribute('data-theme', 'dark');

        await waitFor(() => expect(onChange).toHaveBeenCalledWith('dark'));
    });

    it('reports the return trip to light', async () => {
        const onChange = vi.fn();
        document.documentElement.setAttribute('data-theme', 'dark');
        renderHook(() => useThemeObserver(onChange));

        document.documentElement.setAttribute('data-theme', 'light');

        await waitFor(() => expect(onChange).toHaveBeenCalledWith('light'));
    });

    it('stays silent when the attribute is rewritten with the same value', async () => {
        const onChange = vi.fn();
        document.documentElement.setAttribute('data-theme', 'dark');
        renderHook(() => useThemeObserver(onChange));

        document.documentElement.setAttribute('data-theme', 'dark');

        await waitFor(() => expect(document.documentElement).toHaveAttribute('data-theme', 'dark'));
        expect(onChange).not.toHaveBeenCalled();
    });

    it('always calls the latest callback without re-subscribing', async () => {
        const first = vi.fn();
        const second = vi.fn();
        const { rerender } = renderHook(({ cb }: { cb: (theme: string) => void }) => useThemeObserver(cb), {
            initialProps: { cb: first as (theme: string) => void },
        });

        rerender({ cb: second as (theme: string) => void });
        document.documentElement.setAttribute('data-theme', 'dark');

        await waitFor(() => expect(second).toHaveBeenCalledWith('dark'));
        expect(first).not.toHaveBeenCalled();
    });

    it('disconnects the observer on unmount', async () => {
        const onChange = vi.fn();
        const { unmount } = renderHook(() => useThemeObserver(onChange));

        unmount();
        document.documentElement.setAttribute('data-theme', 'dark');

        await waitFor(() => expect(document.documentElement).toHaveAttribute('data-theme', 'dark'));
        expect(onChange).not.toHaveBeenCalled();
    });
});
