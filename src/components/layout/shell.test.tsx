import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@/test/render';
import { Container } from './Container';
import { IndexRail } from './IndexRail';
import { Section } from './Section';
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
});

describe('IndexRail', () => {
    it('is hidden from the accessibility tree and exposes no tab stops', () => {
        render(<IndexRail activeId="work" />);

        const rail = screen.getByRole('complementary', { hidden: true });
        expect(rail).toHaveAttribute('aria-hidden', 'true');
        expect(within(rail).queryAllByRole('link', { hidden: true })).toHaveLength(0);
        expect(within(rail).queryAllByRole('button', { hidden: true })).toHaveLength(0);
    });
});
