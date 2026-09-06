import { useEffect, useRef } from 'react';
import type { ColorScheme } from '@/hooks/useColorScheme';

/**
 * The cross-application source of truth for the colour scheme is the
 * `data-theme` attribute on `<html>` — written by `useColorScheme` and by the
 * pre-paint script in `index.html`. `useColorScheme` itself holds
 * instance-local state, so consumers outside `ThemeToggle` read the attribute.
 */
export function readThemeAttribute(): ColorScheme {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

/**
 * Calls `onChange` whenever the document theme actually changes value.
 *
 * Deliberately does not return state: subscribers drive imperative animation
 * directly, so a theme flip costs zero React re-renders.
 */
export function useThemeObserver(onChange: (theme: ColorScheme) => void): void {
    const callbackRef = useRef(onChange);

    useEffect(() => {
        callbackRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        let current = readThemeAttribute();

        const observer = new MutationObserver(() => {
            const next = readThemeAttribute();
            if (next === current) return;
            current = next;
            callbackRef.current(next);
        });

        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        return () => observer.disconnect();
    }, []);
}
