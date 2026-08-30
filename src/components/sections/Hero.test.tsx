import { describe, expect, it } from 'vitest';
import type { SiteProfile } from '@/data/types';
import { renderWithUser, screen, within } from '@/test/render';
import { Hero } from './Hero';

const mockProfile: SiteProfile = {
    name: 'Jane Doe',
    role: 'Staff UI Engineer',
    statement: 'Crafting resilient design systems and accessible frontends.',
    status: 'San Francisco, CA · open to consulting',
    links: {
        linkedin: 'https://linkedin.com/in/janedoe',
        github: 'https://github.com/janedoe',
        email: 'jane@example.com',
        cv: '/cv/jane-doe.pdf',
    },
};

describe('Hero', () => {
    it('renders without crashing when no prop is supplied', () => {
        renderWithUser(<Hero />);

        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();

        const workCta = screen.getByRole('link', { name: 'View Work' });
        expect(workCta).toHaveAttribute('href', '#work');

        const contactCta = screen.getByRole('link', { name: 'Get in touch' });
        expect(contactCta).toHaveAttribute('href', '#contact');
    });

    it('renders custom profile data when profile prop is provided', () => {
        renderWithUser(<Hero profile={mockProfile} />);

        expect(screen.getByRole('heading', { level: 1, name: 'Jane Doe' })).toBeInTheDocument();
        expect(screen.getByText('alex@Staff UI Engineer ~ %')).toBeInTheDocument();
        expect(screen.getByText('Crafting resilient design systems and accessible frontends.')).toBeInTheDocument();
        expect(screen.getByText('San Francisco, CA · open to consulting')).toBeInTheDocument();
    });

    it('handles partial or empty statement fields gracefully', () => {
        const partialProfile: SiteProfile = {
            ...mockProfile,
            statement: '',
        };

        const { rerender } = renderWithUser(<Hero profile={partialProfile} />);
        expect(screen.queryByText(/alex@/)).not.toBeInTheDocument();

        rerender(
            <Hero
                profile={{
                    ...mockProfile,
                    role: '',
                    statement: 'Solo statement only.',
                }}
            />,
        );
        expect(screen.getByText('alex ~ %')).toBeInTheDocument();
        expect(screen.getByText('Solo statement only.')).toBeInTheDocument();

        rerender(
            <Hero
                profile={{
                    ...mockProfile,
                    role: '',
                    statement: '',
                }}
            />,
        );
        expect(screen.queryByText(/alex/)).not.toBeInTheDocument();
    });

    it('omits the status badge when status is empty', () => {
        const noStatusProfile: SiteProfile = {
            ...mockProfile,
            status: '',
        };

        renderWithUser(<Hero profile={noStatusProfile} />);
        expect(screen.queryByText(/open to consulting/i)).not.toBeInTheDocument();
    });

    it('renders action links with correct CTA roles and target anchors', () => {
        renderWithUser(<Hero />);

        const navGroup = screen.getByRole('link', { name: 'View Work' }).parentElement;
        expect(navGroup).not.toBeNull();

        if (navGroup) {
            const links = within(navGroup).getAllByRole('link');
            expect(links).toHaveLength(2);
            expect(links[0]).toHaveAttribute('href', '#work');
            expect(links[1]).toHaveAttribute('href', '#contact');
        }
    });

    it('applies custom className when provided', () => {
        const { container } = renderWithUser(<Hero className="custom-hero-class" />);
        expect(container.firstChild).toHaveClass('custom-hero-class');
    });
});
