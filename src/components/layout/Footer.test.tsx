import { afterEach, describe, expect, it } from 'vitest';
import { siteProfile } from '@/data/site';
import { render, screen } from '@/test/render';
import { Footer } from './Footer';

const originalLinks = { ...siteProfile.links };

afterEach(() => {
    Object.assign(siteProfile.links, originalLinks);
});

describe('Footer', () => {
    it('renders the contentinfo landmark with the data-driven identity and copyright year', () => {
        render(<Footer />);

        const footer = screen.getByRole('contentinfo');
        expect(footer).toHaveTextContent(siteProfile.name);
        expect(footer).toHaveTextContent(`© ${new Date().getFullYear()} · All rights reserved`);
    });

    it('emits every non-empty profile link and omits empty-string ones', () => {
        Object.assign(siteProfile.links, {
            linkedin: 'https://linkedin.com/in/example',
            github: '',
            email: '',
            cv: '',
        });

        render(<Footer />);

        expect(screen.getByRole('link', { name: 'LinkedIn profile' })).toHaveAttribute(
            'href',
            'https://linkedin.com/in/example',
        );
        expect(screen.queryByRole('link', { name: 'GitHub profile' })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Send email' })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: 'Download CV' })).not.toBeInTheDocument();
    });

    it('renders github, email, and cv actions when those links are supplied', () => {
        Object.assign(siteProfile.links, {
            linkedin: '',
            github: 'https://github.com/example',
            email: 'hello@example.com',
            cv: '/cv.pdf',
        });

        render(<Footer />);

        expect(screen.getByRole('link', { name: 'GitHub profile' })).toHaveAttribute(
            'href',
            'https://github.com/example',
        );
        expect(screen.getByRole('link', { name: 'Send email' })).toHaveAttribute('href', 'mailto:hello@example.com');
        expect(screen.getByRole('link', { name: 'Download CV' })).toHaveAttribute('href', '/cv.pdf');
        expect(screen.queryByRole('link', { name: 'LinkedIn profile' })).not.toBeInTheDocument();
    });
});
