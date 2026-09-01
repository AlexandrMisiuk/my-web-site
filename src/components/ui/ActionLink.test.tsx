import { describe, expect, it, vi } from 'vitest';
import { renderWithUser, screen } from '@/test/render';
import { ActionLink } from './ActionLink';

describe('ActionLink', () => {
    it('renders an anchor when href is present and a button otherwise', () => {
        const { rerender } = renderWithUser(<ActionLink href="#work">Work</ActionLink>);
        expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '#work');

        rerender(<ActionLink>Save</ActionLink>);
        expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button');
    });

    it('treats http(s) hrefs as external with a new-tab affordance', () => {
        renderWithUser(<ActionLink href="https://example.com">Portfolio</ActionLink>);

        const link = screen.getByRole('link', { name: /portfolio/i });
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        expect(screen.getByText('(opens in a new tab)')).toBeInTheDocument();
    });

    it('keeps hash hrefs in-tab without the external icon', () => {
        renderWithUser(<ActionLink href="#contact">Contact</ActionLink>);

        const link = screen.getByRole('link', { name: 'Contact' });
        expect(link).not.toHaveAttribute('target');
        expect(link).not.toHaveAttribute('rel');
        expect(screen.queryByText('(opens in a new tab)')).not.toBeInTheDocument();
    });

    it('lets isExternal, target, and rel override auto-detection', () => {
        const { rerender } = renderWithUser(
            <ActionLink href="https://example.com" isExternal={false}>
                Internalized
            </ActionLink>,
        );

        expect(screen.getByRole('link', { name: 'Internalized' })).not.toHaveAttribute('target');
        expect(screen.queryByText('(opens in a new tab)')).not.toBeInTheDocument();

        rerender(
            <ActionLink href="/local" isExternal target="_self" rel="noreferrer">
                Forced
            </ActionLink>,
        );

        const forced = screen.getByRole('link', { name: /forced/i });
        expect(forced).toHaveAttribute('target', '_self');
        expect(forced).toHaveAttribute('rel', 'noreferrer');
        expect(screen.getByText('(opens in a new tab)')).toBeInTheDocument();
    });

    it('fires onClick for both the anchor and button branches', async () => {
        const onAnchorClick = vi.fn((event: { preventDefault(): void }) => event.preventDefault());
        const onButtonClick = vi.fn();
        const { user, rerender } = renderWithUser(
            <ActionLink href="#work" onClick={onAnchorClick}>
                Work
            </ActionLink>,
        );

        await user.click(screen.getByRole('link', { name: 'Work' }));
        expect(onAnchorClick).toHaveBeenCalledOnce();

        rerender(<ActionLink onClick={onButtonClick}>Save</ActionLink>);
        await user.click(screen.getByRole('button', { name: 'Save' }));
        expect(onButtonClick).toHaveBeenCalledOnce();
    });

    it('honours variant, download, type, and aria-label props', () => {
        const { rerender } = renderWithUser(
            <ActionLink href="/cv.pdf" variant="ghost" download aria-label="Download CV">
                CV
            </ActionLink>,
        );

        expect(screen.getByRole('link', { name: 'Download CV' })).toHaveAttribute('download');

        rerender(
            <ActionLink type="submit" aria-label="Submit form">
                Go
            </ActionLink>,
        );
        expect(screen.getByRole('button', { name: 'Submit form' })).toHaveAttribute('type', 'submit');
    });

    it('renders compound children directly as flex items for both link and button', () => {
        const { rerender } = renderWithUser(
            <ActionLink href="mailto:test@example.com">
                <span data-testid="icon">icon</span>
                <span>Email</span>
            </ActionLink>,
        );

        const link = screen.getByRole('link', { name: /email/i });
        expect(link).toHaveTextContent('Email');
        expect(screen.getByTestId('icon')).toBeInTheDocument();
        expect(screen.getByTestId('icon').parentElement).toBe(link);

        rerender(
            <ActionLink>
                <span data-testid="icon-btn">icon</span>
                <span>Click</span>
            </ActionLink>,
        );

        const button = screen.getByRole('button', { name: /click/i });
        expect(button).toHaveTextContent('Click');
        expect(screen.getByTestId('icon-btn')).toBeInTheDocument();
        expect(screen.getByTestId('icon-btn').parentElement).toBe(button);
    });
});
