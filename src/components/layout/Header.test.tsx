import { describe, expect, it } from 'vitest';
import type { NavItem, SiteProfile } from '@/data/types';
import { renderWithUser, screen, within } from '@/test/render';
import { Header } from './Header';

const mockNavItems: readonly NavItem[] = [
    { id: 'work', label: 'Selected Work', index: '01' },
    { id: 'how-i-work', label: 'How I Work', index: '02' },
    { id: 'about', label: 'About', index: '03' },
    { id: 'technologies', label: 'Technologies', index: '04' },
    { id: 'contact', label: 'Contact', index: '05' },
];

const mockProfile: SiteProfile = {
    name: 'Alex Developer',
    role: 'Software Engineer',
    statement: 'Building software.',
    status: 'Available',
    links: {
        linkedin: 'https://linkedin.com/in/example',
        github: 'https://github.com/example',
        email: 'hello@example.com',
        cv: '/cv/test.pdf',
    },
};

describe('Header', () => {
    it('renders the Primary nav landmark with every nav item', () => {
        renderWithUser(<Header activeId="work" items={mockNavItems} profile={mockProfile} />);

        const nav = screen.getByRole('navigation', { name: 'Primary' });
        for (const item of mockNavItems) {
            expect(within(nav).getByRole('link', { name: new RegExp(item.label) })).toHaveAttribute(
                'href',
                `#${item.id}`,
            );
        }
    });

    it('marks only the active item with aria-current', () => {
        renderWithUser(<Header activeId="about" items={mockNavItems} profile={mockProfile} />);

        const nav = screen.getByRole('navigation', { name: 'Primary' });
        expect(within(nav).getByRole('link', { name: /about/i })).toHaveAttribute('aria-current', 'true');
        expect(within(nav).getByRole('link', { name: /selected work/i })).not.toHaveAttribute('aria-current');
    });

    it('toggles the hamburger expanded state and accessible name', async () => {
        const { user } = renderWithUser(<Header activeId="work" items={mockNavItems} profile={mockProfile} />);
        const trigger = screen.getByRole('button', { name: 'Open menu' });

        expect(trigger).toHaveAttribute('aria-expanded', 'false');

        await user.click(trigger);

        expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('dialog', { name: 'Navigation menu' })).toBeInTheDocument();

        await user.keyboard('{Escape}');
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
    });

    it('does not render a CV action link even when a cv link is provided', () => {
        renderWithUser(<Header activeId="work" items={mockNavItems} profile={mockProfile} />);

        expect(screen.queryByRole('link', { name: 'CV' })).not.toBeInTheDocument();
    });

    it('renders without crashing when default props are used', () => {
        renderWithUser(<Header activeId="work" />);
        expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
    });
});
