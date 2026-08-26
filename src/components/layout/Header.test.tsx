import { afterEach, describe, expect, it } from 'vitest';
import { navItems } from '@/data/navigation';
import { siteProfile } from '@/data/site';
import { renderWithUser, screen, within } from '@/test/render';
import { Header } from './Header';

const originalLinks = { ...siteProfile.links };

afterEach(() => {
    Object.assign(siteProfile.links, originalLinks);
});

describe('Header', () => {
    it('renders the Primary nav landmark with every nav item', () => {
        renderWithUser(<Header activeId="work" />);

        const nav = screen.getByRole('navigation', { name: 'Primary' });
        for (const item of navItems) {
            expect(within(nav).getByRole('link', { name: new RegExp(item.label) })).toHaveAttribute(
                'href',
                `#${item.id}`,
            );
        }
    });

    it('marks only the active item with aria-current', () => {
        renderWithUser(<Header activeId="about" />);

        const nav = screen.getByRole('navigation', { name: 'Primary' });
        expect(within(nav).getByRole('link', { name: /about/i })).toHaveAttribute('aria-current', 'true');
        expect(within(nav).getByRole('link', { name: /selected work/i })).not.toHaveAttribute('aria-current');
    });

    it('toggles the hamburger expanded state and accessible name', async () => {
        const { user } = renderWithUser(<Header activeId="work" />);
        const trigger = screen.getByRole('button', { name: 'Open menu' });

        expect(trigger).toHaveAttribute('aria-expanded', 'false');

        await user.click(trigger);

        expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('dialog', { name: 'Navigation menu' })).toBeInTheDocument();

        await user.keyboard('{Escape}');
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
    });

    it('omits the CV action when the cv link is empty', () => {
        siteProfile.links.cv = '';
        renderWithUser(<Header activeId="work" />);

        expect(screen.queryByRole('link', { name: 'CV' })).not.toBeInTheDocument();
    });

    it('renders the CV action when a cv link is provided', () => {
        siteProfile.links.cv = '/cv/test.pdf';
        renderWithUser(<Header activeId="work" />);

        expect(screen.getByRole('link', { name: 'CV' })).toHaveAttribute('href', '/cv/test.pdf');
    });
});
