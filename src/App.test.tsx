import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { emitIntersections } from '@/test/intersectionObserver';
import { renderWithUser, screen, within } from '@/test/render';
import App from './App';

describe('App', () => {
    it('composes the skip link, header, main landmark, and footer', () => {
        renderWithUser(<App />);

        expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute('href', '#main');
        expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
        expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
        expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    });

    it('wires the active section into the primary navigation', () => {
        renderWithUser(<App />);

        act(() => {
            emitIntersections([{ id: 'about', isIntersecting: true }]);
        });

        const nav = screen.getByRole('navigation', { name: 'Primary' });
        expect(within(nav).getByRole('link', { name: /about/i })).toHaveAttribute('aria-current', 'true');
    });

    it('opens and closes the mobile navigation from the header trigger', async () => {
        const { user } = renderWithUser(<App />);

        await user.click(screen.getByRole('button', { name: 'Open menu' }));
        expect(screen.getByRole('dialog', { name: 'Navigation menu' })).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Close menu' }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});
