import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { emitIntersections } from '@/test/intersectionObserver';
import { renderWithUser, screen, within } from '@/test/render';
import App from './App';

describe('App', () => {
    it('composes the skip link, header, main landmark, and footer with valid heading hierarchy', () => {
        renderWithUser(<App />);

        expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute('href', '#main');
        expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
        expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();

        const h1Headings = screen.getAllByRole('heading', { level: 1 });
        expect(h1Headings).toHaveLength(1);
        expect(h1Headings[0]).toHaveTextContent('Oleksandr Misiuk');

        // All 5 numbered section headers render h2 headings
        expect(screen.getByRole('heading', { level: 2, name: 'Selected Work' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: 'How I Work' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: 'About' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: 'Technologies' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: 'Contact' })).toBeInTheDocument();

        // Selected Work items (h3)
        expect(screen.getByRole('heading', { level: 3, name: 'Personal Product' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 3, name: 'Enterprise Web Platform' })).toBeInTheDocument();

        // How I Work engineering principles (h3)
        expect(screen.getByRole('heading', { level: 3, name: 'Product first' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 3, name: 'Thoughtful architecture' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 3, name: 'Details matter' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 3, name: 'Ownership' })).toBeInTheDocument();

        // Technologies list
        expect(screen.getByRole('list', { name: /technologies/i })).toBeInTheDocument();

        // Contact section content
        expect(screen.getByText("Let's build something great.")).toBeInTheDocument();
        expect(within(screen.getByRole('main')).getByRole('link', { name: /linkedin/i })).toBeInTheDocument();
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
