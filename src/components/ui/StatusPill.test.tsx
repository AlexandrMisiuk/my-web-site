import { describe, expect, it } from 'vitest';
import { render, screen } from '@/test/render';
import { StatusPill } from './StatusPill';

describe('StatusPill', () => {
    it('renders children content and applies base styling', () => {
        render(<StatusPill data-testid="status-pill">Available for hire</StatusPill>);
        const pill = screen.getByTestId('status-pill');
        expect(pill).toBeInTheDocument();
        expect(screen.getByText('Available for hire')).toBeInTheDocument();
    });

    it('renders static indicator by default and pulsing indicator when pulse is enabled', () => {
        const { rerender } = render(<StatusPill data-testid="status-pill">Shipped</StatusPill>);
        expect(screen.getByTestId('status-pill')).toBeInTheDocument();

        rerender(
            <StatusPill data-testid="status-pill" pulse>
                Shipped
            </StatusPill>,
        );
        expect(screen.getByTestId('status-pill')).toBeInTheDocument();
    });

    it.each(['emerald', 'amber', 'accent', 'muted'] as const)(
        'supports "%s" color variant in both static and pulsing modes',
        (color) => {
            const { rerender } = render(
                <StatusPill data-testid={`status-${color}`} color={color}>
                    {color}
                </StatusPill>,
            );
            expect(screen.getByTestId(`status-${color}`)).toBeInTheDocument();

            rerender(
                <StatusPill data-testid={`status-${color}`} color={color} pulse>
                    {color}
                </StatusPill>,
            );
            expect(screen.getByTestId(`status-${color}`)).toBeInTheDocument();
        },
    );

    it('supports canvas and surface background variants', () => {
        const { rerender } = render(
            <StatusPill data-testid="status-variant" variant="canvas">
                Canvas
            </StatusPill>,
        );
        expect(screen.getByTestId('status-variant')).toBeInTheDocument();

        rerender(
            <StatusPill data-testid="status-variant" variant="surface">
                Surface
            </StatusPill>,
        );
        expect(screen.getByTestId('status-variant')).toBeInTheDocument();
    });

    it('supports small and medium size variants', () => {
        const { rerender } = render(
            <StatusPill data-testid="status-size" size="sm">
                Small
            </StatusPill>,
        );
        expect(screen.getByTestId('status-size')).toBeInTheDocument();

        rerender(
            <StatusPill data-testid="status-size" size="md">
                Medium
            </StatusPill>,
        );
        expect(screen.getByTestId('status-size')).toBeInTheDocument();
    });

    it('forwards custom className and standard HTML attributes', () => {
        render(
            <StatusPill className="custom-class" data-testid="custom-status" id="status-badge" role="status">
                Active
            </StatusPill>,
        );
        const element = screen.getByRole('status');
        expect(element).toHaveAttribute('id', 'status-badge');
        expect(element).toHaveAttribute('data-testid', 'custom-status');
    });
});
