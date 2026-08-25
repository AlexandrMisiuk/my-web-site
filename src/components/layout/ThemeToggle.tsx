import { useColorScheme } from '@/hooks/useColorScheme';
import { MoonIcon, SunIcon } from '@/components/ui/icons';

export interface ThemeToggleProps {
    className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
    const { isDark, toggle } = useColorScheme();

    return (
        <button
            type="button"
            onClick={toggle}
            aria-pressed={isDark}
            aria-label="Toggle color scheme"
            className={`text-ink-muted hover:border-hairline hover:bg-surface hover:text-ink focus-visible:outline-accent inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[var(--radius-sm)] border border-transparent p-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
        >
            {isDark ? (
                <SunIcon size={20} className="transition-transform duration-200" />
            ) : (
                <MoonIcon size={20} className="transition-transform duration-200" />
            )}
        </button>
    );
}
