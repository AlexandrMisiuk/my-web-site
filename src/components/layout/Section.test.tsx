import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@/test/render';
import { Section } from './Section';

describe('Section', () => {
    it('applies the scroll-anchor id and wires aria-labelledby to its heading', () => {
        render(
            <Section id="work" label="Selected Work">
                Case studies
            </Section>,
        );

        const section = screen.getByRole('region', { name: 'Selected Work' });
        expect(section).toHaveAttribute('id', 'work');
        expect(section).toHaveAttribute('aria-labelledby', 'work-heading');
        expect(screen.getByRole('heading', { level: 2, name: 'Selected Work' })).toHaveAttribute('id', 'work-heading');
    });

    it('skips the section header when label is missing', () => {
        render(<Section id="work">Body</Section>);
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
            <Section id="work" label="Selected Work">
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
