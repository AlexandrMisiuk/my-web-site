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

    it('does not render any profile links or action links', () => {
        render(<Footer profile={mockProfile} />);

        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('renders without crashing when no profile prop is supplied', () => {
        render(<Footer />);
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('merges custom className when provided', () => {
        render(<Footer className="custom-footer" />);
        expect(screen.getByRole('contentinfo')).toHaveClass('custom-footer');
    });
});
