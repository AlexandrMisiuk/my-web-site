import { describe, expect, it } from 'vitest';
import { renderWithUser, screen } from '@/test/render';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
    it('exposes aria-pressed from the current scheme and swaps the icon on click', async () => {
        const { user } = renderWithUser(<ThemeToggle />);
        const toggle = screen.getByRole('button', { name: 'Toggle color scheme' });

        expect(toggle).toHaveAttribute('aria-pressed', 'false');
        expect(toggle.querySelector('circle')).toBeNull();

        await user.click(toggle);

        expect(toggle).toHaveAttribute('aria-pressed', 'true');
        expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
        expect(toggle.querySelector('circle')).not.toBeNull();
    });
});
