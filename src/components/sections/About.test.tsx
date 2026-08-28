import { describe, expect, it } from 'vitest';
import type { AboutContent } from '@/data/types';
import { renderWithUser, screen } from '@/test/render';
import { About } from './About';

const customAboutContent: AboutContent = {
    paragraphs: [
        'First custom paragraph about engineering experience.',
        'Second custom paragraph about frontend architecture.',
    ],
};

describe('About', () => {
    it('renders default biographical paragraphs from data module when no prop is provided', () => {
        renderWithUser(<About />);

        expect(
            screen.getByText(/Senior Frontend Engineer with deep experience architecting responsive/i),
        ).toBeInTheDocument();
        expect(screen.getByText(/Focused on building accessible, resilient user interfaces/i)).toBeInTheDocument();
        expect(screen.getByText(/Experienced across the full development lifecycle/i)).toBeInTheDocument();
    });

    it('renders custom biographical paragraphs passed via props', () => {
        renderWithUser(<About content={customAboutContent} />);

        expect(screen.getByText('First custom paragraph about engineering experience.')).toBeInTheDocument();
        expect(screen.getByText('Second custom paragraph about frontend architecture.')).toBeInTheDocument();
        expect(
            screen.queryByText(/Senior Frontend Engineer with deep experience architecting responsive/i),
        ).not.toBeInTheDocument();
    });

    it('renders accessible fallback message when paragraphs list is empty', () => {
        renderWithUser(<About content={{ paragraphs: [] }} />);

        expect(screen.getByText('Biography will be published soon.')).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
        const { container } = renderWithUser(<About className="custom-about-class" />);

        expect(container.firstChild).toHaveClass('custom-about-class');
    });

    it('applies custom className to empty state container', () => {
        const { container } = renderWithUser(
            <About content={{ paragraphs: [] }} className="custom-about-empty-class" />,
        );

        expect(container.firstChild).toHaveClass('custom-about-empty-class');
    });
});
