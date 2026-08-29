import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@/test/render';
import { Container } from './Container';
import { IndexRail } from './IndexRail';
import { Section, SectionBackground } from './Section';
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

describe('SectionBackground', () => {
    it('renders a single decorative light image with default lazy loading when dark is omitted', () => {
        render(<SectionBackground light="/assets/light.jpg" />);

        const images = document.querySelectorAll('img');
        expect(images).toHaveLength(1);

        const lightImg = images[0];
        expect(lightImg).toHaveAttribute('src', '/assets/light.jpg');
        expect(lightImg).toHaveAttribute('alt', '');
        expect(lightImg).toHaveAttribute('loading', 'lazy');
        expect(lightImg).toHaveAttribute('fetchpriority', 'auto');
        expect(lightImg).toHaveAttribute('decoding', 'async');
    });

    it('renders dual theme images with eager priority when priority is true', () => {
        render(<SectionBackground light="/assets/light.jpg" dark="/assets/dark.jpg" priority />);

        const images = document.querySelectorAll('img');
        expect(images).toHaveLength(2);

        const [lightImg, darkImg] = images;

        expect(lightImg).toHaveAttribute('src', '/assets/light.jpg');
        expect(lightImg).toHaveAttribute('alt', '');
        expect(lightImg).toHaveAttribute('loading', 'eager');
        expect(lightImg).toHaveAttribute('fetchpriority', 'high');
        expect(lightImg).toHaveAttribute('decoding', 'async');

        expect(darkImg).toHaveAttribute('src', '/assets/dark.jpg');
        expect(darkImg).toHaveAttribute('alt', '');
        expect(darkImg).toHaveAttribute('loading', 'eager');
        expect(darkImg).toHaveAttribute('fetchpriority', 'high');
        expect(darkImg).toHaveAttribute('decoding', 'async');
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
