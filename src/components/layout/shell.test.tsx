import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@/test/render';
import { Container } from './Container';
import { Section } from './Section';
import { SectionHeader } from './SectionHeader';
import { SkipLink } from './SkipLink';

describe('SkipLink', () => {
    it('targets #main by default and honours a custom target', () => {
        const { rerender } = render(<SkipLink />);
        expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute('href', '#main');

        rerender(<SkipLink targetId="work">Skip to work</SkipLink>);
        expect(screen.getByRole('link', { name: 'Skip to work' })).toHaveAttribute('href', '#work');
    });
});

describe('Container', () => {
    it('renders as a div by default and honours the polymorphic as prop', () => {
        const { rerender } = render(<Container>Content</Container>);
        expect(screen.getByText('Content').tagName).toBe('DIV');

        rerender(
            <Container as="nav" grid>
                Menu
            </Container>,
        );
        expect(screen.getByRole('navigation')).toHaveTextContent('Menu');
    });
});

describe('Section', () => {
    it('applies the scroll-anchor id and wires aria-labelledby to its heading', () => {
        render(
            <Section id="work" index="01" label="Selected Work">
                Case studies
            </Section>,
        );

        const section = screen.getByRole('region', { name: 'Selected Work' });
        expect(section).toHaveAttribute('id', 'work');
        expect(section).toHaveAttribute('aria-labelledby', 'work-heading');
        expect(screen.getByRole('heading', { level: 2, name: 'Selected Work' })).toHaveAttribute('id', 'work-heading');
    });

    it('skips the section header when index or label is missing', () => {
        const { rerender } = render(
            <Section id="work" index="01">
                Body
            </Section>,
        );
        expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();

        rerender(
            <Section id="work" label="Selected Work">
                Body
            </Section>,
        );
        expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    });

    it('omits the labelled heading in the plain variant', () => {
        render(
            <Section id="hero" variant="plain">
                <h1>Hero</h1>
            </Section>,
        );

        expect(screen.getByRole('heading', { level: 1, name: 'Hero' })).toBeInTheDocument();
        expect(screen.queryByRole('region', { name: 'Hero' })).not.toBeInTheDocument();
    });

    it('omits the decorative wrapper when background is not provided', () => {
        render(
            <Section id="work" index="01" label="Selected Work">
                Body
            </Section>,
        );

        const section = screen.getByRole('region', { name: 'Selected Work' });
        expect(section.querySelector('[aria-hidden="true"]')).toBeNull();
    });

    it('renders a full-bleed decorative background wrapper when provided without adding tab stops', () => {
        render(
            <Section id="hero" variant="plain" background={<div data-testid="bg-layer">Background layer</div>}>
                <h1>Hero</h1>
            </Section>,
        );

        const bgLayer = screen.getByTestId('bg-layer');
        const bgWrapper = bgLayer.parentElement;

        expect(bgWrapper).not.toBeNull();
        expect(bgWrapper).toHaveAttribute('aria-hidden', 'true');
        expect(within(bgWrapper as HTMLElement).queryAllByRole('link', { hidden: true })).toHaveLength(0);
        expect(within(bgWrapper as HTMLElement).queryAllByRole('button', { hidden: true })).toHaveLength(0);
        expect(screen.getByRole('heading', { level: 1, name: 'Hero' })).toBeInTheDocument();
    });
});

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
