import { describe, expect, it } from 'vitest';
import { renderWithUser, screen } from '@/test/render';
import { Technologies } from './Technologies';

const customTechnologies: readonly string[] = ['React', 'TypeScript', 'Node.js', 'PostgreSQL'];

describe('Technologies', () => {
    it('renders default technologies from data module when no prop is provided', () => {
        renderWithUser(<Technologies />);

        const list = screen.getByRole('list', { name: /technologies/i });
        expect(list).toBeInTheDocument();

        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('React Native')).toBeInTheDocument();
        expect(screen.getByText('Angular')).toBeInTheDocument();
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText('HTML')).toBeInTheDocument();
        expect(screen.getByText('CSS')).toBeInTheDocument();
        expect(screen.getByText('RxJS')).toBeInTheDocument();
        expect(screen.getByText('REST APIs')).toBeInTheDocument();
        expect(screen.getByText('Git')).toBeInTheDocument();

        const items = screen.getAllByRole('listitem');
        expect(items).toHaveLength(10);
    });

    it('renders custom technologies passed via props', () => {
        renderWithUser(<Technologies technologies={customTechnologies} />);

        expect(screen.getByText('Node.js')).toBeInTheDocument();
        expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
        expect(screen.queryByText('Angular')).not.toBeInTheDocument();

        const items = screen.getAllByRole('listitem');
        expect(items).toHaveLength(4);
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
