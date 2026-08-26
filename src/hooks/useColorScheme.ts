import { useEffect, useState } from 'react';

export type ColorScheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';

function resolveInitialTheme(): ColorScheme {
    try {
        const stored = sessionStorage.getItem(THEME_STORAGE_KEY);
        if (stored === 'dark' || stored === 'light') {
            return stored;
        }
    } catch {
        // Fallback if sessionStorage is disabled or restricted
    }

    const domTheme = document.documentElement.getAttribute('data-theme');
    if (domTheme === 'dark' || domTheme === 'light') {
        return domTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useColorScheme() {
    const [theme, setThemeState] = useState<ColorScheme>(resolveInitialTheme);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleMediaChange = (e: MediaQueryListEvent) => {
            let hasSessionOverride = false;
            try {
                hasSessionOverride = sessionStorage.getItem(THEME_STORAGE_KEY) !== null;
            } catch {
                // Fallback if sessionStorage is restricted
            }

            if (!hasSessionOverride) {
                const nextTheme: ColorScheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', nextTheme);
                setThemeState(nextTheme);
            }
        };

        mediaQuery.addEventListener('change', handleMediaChange);
        return () => mediaQuery.removeEventListener('change', handleMediaChange);
    }, []);

    const setTheme = (nextTheme: ColorScheme) => {
        setThemeState(nextTheme);
        document.documentElement.setAttribute('data-theme', nextTheme);
        try {
            sessionStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        } catch {
            // Fallback if sessionStorage is restricted
        }
    };

    const toggle = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return {
        theme,
        toggle,
        setTheme,
        isDark: theme === 'dark',
    };
}
