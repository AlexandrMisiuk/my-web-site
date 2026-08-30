import { describe, expect, it } from 'vitest';
import { render, screen } from '@/test/render';
import { SectionHeader } from './SectionHeader';

describe('SectionHeader', () => {
    it('renders index, label and heading without font-sans class so it inherits monospace typography', () => {
        render(<SectionHeader index="01" label="Selected Work" headingId="work-heading" />);

        expect(screen.getByText('01 / Selected Work')).toBeInTheDocument();
        const heading = screen.getByRole('heading', { level: 2, name: 'Selected Work' });
        expect(heading).toHaveAttribute('id', 'work-heading');
        expect(heading.className).not.toContain('font-sans');
    });

    it('applies custom className to the header element', () => {
        const { container } = render(
            <SectionHeader index="02" label="About" headingId="about-heading" className="custom-header-class" />,
        );

        expect(container.firstChild).toHaveClass('custom-header-class');
    });
});
