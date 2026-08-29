import { describe, expect, it } from 'vitest';
import type { SiteProfile } from '@/data/types';
import { render, screen } from '@/test/render';
import { Footer } from './Footer';

const mockProfile: SiteProfile = {
    name: 'Alex Developer',
    role: 'Software Engineer',
    statement: 'Building clean software.',
    status: 'Available',
    links: {
        linkedin: 'https://linkedin.com/in/example',
        github: 'https://github.com/example',
        email: 'hello@example.com',
        cv: '/cv.pdf',
    },
};

describe('Footer', () => {
    it('renders the contentinfo landmark with the data-driven identity and copyright year', () => {
        render(<Footer profile={mockProfile} />);

        const footer = screen.getByRole('contentinfo');
        expect(footer).toHaveTextContent('Alex Developer');
        expect(footer).toHaveTextContent(`© ${new Date().getFullYear()} · All rights reserved`);
    });

    it('emits every non-empty profile link and omits empty-string ones', () => {
        const profileWithLinkedInOnly: SiteProfile = {
            ...mockProfile,
            links: {
                linkedin: 'https://linkedin.com/in/example',
                github: '',
                email: '',
                cv: '',
            },
        };

        render(<Footer profile={profileWithLinkedInOnly} />);

        expect(screen.getByRole('link', { name: 'LinkedIn profile' })).toHaveAttribute(
            'href',
            'https://linkedin.com/in/example',
        );
        expect(screen.queryByRole('link', { name: 'GitHub profile' })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Send email' })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Download CV' })).not.toBeInTheDocument();
    });

    it('renders github, email, and cv actions when those links are supplied', () => {
        const profileWithoutLinkedIn: SiteProfile = {
            ...mockProfile,
            links: {
                linkedin: '',
                github: 'https://github.com/example',
                email: 'hello@example.com',
                cv: '/cv.pdf',
            },
        };

        render(<Footer profile={profileWithoutLinkedIn} />);

        expect(screen.getByRole('link', { name: 'GitHub profile' })).toHaveAttribute(
            'href',
            'https://github.com/example',
        );
        expect(screen.getByRole('link', { name: 'Send email' })).toHaveAttribute('href', 'mailto:hello@example.com');
        expect(screen.getByRole('link', { name: 'Download CV' })).toHaveAttribute('href', '/cv.pdf');
        expect(screen.queryByRole('link', { name: 'LinkedIn profile' })).not.toBeInTheDocument();
    });

    it('renders without crashing when no profile prop is supplied', () => {
        render(<Footer />);
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
});
