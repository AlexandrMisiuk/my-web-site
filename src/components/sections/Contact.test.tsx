import { describe, expect, it } from 'vitest';
import type { SiteProfile } from '@/data/types';
import { renderWithUser, screen } from '@/test/render';
import { Contact } from './Contact';

const fullProfile: SiteProfile = {
    name: 'Alex Developer',
    role: 'Senior Frontend Engineer',
    statement: 'I build fast, thoughtful interfaces that people enjoy using.',
    status: 'Wrocław, Poland · open to new opportunities',
    links: {
        linkedin: 'https://linkedin.com/in/alexandr-misiuk',
        github: 'https://github.com/alexandrmisiuk',
        email: 'alexandr@example.com',
        cv: '/cv/Oleksandr_Misiuk_CV.pdf',
    },
};

const partialProfile: SiteProfile = {
    name: 'Alex Developer',
    role: 'Senior Frontend Engineer',
    statement: 'I build fast, thoughtful interfaces that people enjoy using.',
    status: 'Wrocław, Poland',
    links: {
        linkedin: 'https://linkedin.com/in/alexandr-misiuk',
        github: '',
        email: '',
        cv: '',
    },
};

const emailOnlyProfile: SiteProfile = {
    name: 'Alex Developer',
    role: 'Senior Frontend Engineer',
    statement: 'I build fast, thoughtful interfaces that people enjoy using.',
    status: 'Wrocław, Poland',
    links: {
        linkedin: '',
        github: '',
        email: 'alexandr@example.com',
        cv: '',
    },
};

const emptyLinksProfile: SiteProfile = {
    name: 'Alex Developer',
    role: 'Senior Frontend Engineer',
    statement: 'I build fast, thoughtful interfaces that people enjoy using.',
    status: '',
    links: {
        linkedin: '',
        github: '',
        email: '',
        cv: '',
    },
};

describe('Contact', () => {
    it('renders without crashing when no prop is provided', () => {
        renderWithUser(<Contact />);

        expect(screen.getByText("Let's build something great.")).toBeInTheDocument();
    });

    it('renders all action links when full profile is provided', () => {
        renderWithUser(<Contact profile={fullProfile} />);

        const emailLink = screen.getByRole('link', { name: /email/i });
        expect(emailLink).toHaveAttribute('href', 'mailto:alexandr@example.com');

        const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
        expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/alexandr-misiuk');

        const githubLink = screen.getByRole('link', { name: /github/i });
        expect(githubLink).toHaveAttribute('href', 'https://github.com/alexandrmisiuk');

        const cvLink = screen.getByRole('link', { name: /cv/i });
        expect(cvLink).toHaveAttribute('href', '/cv/Oleksandr_Misiuk_CV.pdf');
        expect(cvLink).toHaveAttribute('download', '');
    });

    it('omits empty link strings cleanly without rendering broken anchor tags', () => {
        renderWithUser(<Contact profile={partialProfile} />);

        expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /github/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /email/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /cv/i })).not.toBeInTheDocument();
    });

    it('renders email link and omits missing linkedin link when email only is present', () => {
        renderWithUser(<Contact profile={emailOnlyProfile} />);

        expect(screen.getByRole('link', { name: /email/i })).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /linkedin/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /github/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /cv/i })).not.toBeInTheDocument();
    });

    it('renders clean fallback or empty link state without crash when all links are empty', () => {
        renderWithUser(<Contact profile={emptyLinksProfile} />);

        expect(screen.getByText("Let's build something great.")).toBeInTheDocument();
        expect(screen.queryAllByRole('link')).toHaveLength(0);
    });

    it('applies custom className when provided', () => {
        const { container } = renderWithUser(<Contact className="custom-contact-class" />);

        expect(container.firstChild).toHaveClass('custom-contact-class');
    });
});
