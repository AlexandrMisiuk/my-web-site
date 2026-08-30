import { describe, expect, it } from 'vitest';
import { render, screen } from '@/test/render';
import { Container } from './Container';

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
