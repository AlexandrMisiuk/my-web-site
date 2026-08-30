import { describe, expect, it } from 'vitest';
import { render, screen } from '@/test/render';
import { Eyebrow } from './Eyebrow';

describe('Eyebrow', () => {
    it('renders children as a paragraph by default and honours the as prop', () => {
        const { rerender } = render(<Eyebrow>01 / Work</Eyebrow>);
        expect(screen.getByText('01 / Work').tagName).toBe('P');

        rerender(<Eyebrow as="h2">Section</Eyebrow>);
        expect(screen.getByRole('heading', { level: 2, name: 'Section' })).toBeInTheDocument();

        rerender(<Eyebrow as="h3">Subheading</Eyebrow>);
        expect(screen.getByRole('heading', { level: 3, name: 'Subheading' })).toBeInTheDocument();

        rerender(<Eyebrow as="span">Inline</Eyebrow>);
        expect(screen.getByText('Inline').tagName).toBe('SPAN');

        rerender(<Eyebrow as="div">Block</Eyebrow>);
        expect(screen.getByText('Block').tagName).toBe('DIV');
    });

    it('forwards custom className', () => {
        const { container } = render(<Eyebrow className="custom-eyebrow">Header text</Eyebrow>);
        expect(container.firstChild).toHaveClass('custom-eyebrow');
    });
});
