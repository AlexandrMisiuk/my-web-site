import { describe, expect, it } from 'vitest';
import { renderWithUser, screen } from '@/test/render';
import { Technologies } from './Technologies';

const customTechnologies: readonly string[] = ['React', 'TypeScript', 'Node.js', 'PostgreSQL'];

describe('Technologies', () => {
    it('renders without crashing when no prop is provided', () => {
        const { container } = renderWithUser(<Technologies />);
        expect(container.firstChild).toBeInTheDocument();
    });

    it('renders custom technologies passed via props', () => {
        renderWithUser(<Technologies technologies={customTechnologies} />);

        expect(screen.getByText('Node.js')).toBeInTheDocument();
        expect(screen.getByText('PostgreSQL')).toBeInTheDocument();

        const items = screen.getAllByRole('listitem');
        expect(items).toHaveLength(customTechnologies.length);
    });

    it('renders accessible fallback message when technologies list is empty', () => {
        renderWithUser(<Technologies technologies={[]} />);

        expect(screen.queryByRole('list')).not.toBeInTheDocument();
        expect(screen.getByText('Technologies list will be published soon.')).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
        const { container } = renderWithUser(<Technologies className="custom-technologies-class" />);

        expect(container.firstChild).toHaveClass('custom-technologies-class');
    });

    it('applies custom className to empty state container', () => {
        const { container } = renderWithUser(
            <Technologies technologies={[]} className="custom-technologies-empty-class" />,
        );

        expect(container.firstChild).toHaveClass('custom-technologies-empty-class');
    });
});
