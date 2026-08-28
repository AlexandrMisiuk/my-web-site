import { describe, expect, it } from 'vitest';
import type { Principle } from '@/data/types';
import { renderWithUser, screen } from '@/test/render';
import { HowIWork } from './HowIWork';

const customPrinciples: readonly Principle[] = [
    {
        id: 'principle-one',
        title: 'Clarity over cleverness',
        body: 'Readable and predictable code scales better with growing teams.',
    },
    {
        id: 'principle-two',
        title: 'Automated safety nets',
        body: 'Strong type systems and comprehensive tests enable fearless refactoring.',
    },
];

describe('HowIWork', () => {
    it('renders default principles from data module when no prop is provided', () => {
        renderWithUser(<HowIWork />);

        expect(screen.getByRole('heading', { level: 3, name: 'Product first' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 3, name: 'Thoughtful architecture' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 3, name: 'Details matter' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 3, name: 'Ownership' })).toBeInTheDocument();

        expect(screen.getByText('01')).toBeInTheDocument();
        expect(screen.getByText('02')).toBeInTheDocument();
        expect(screen.getByText('03')).toBeInTheDocument();
        expect(screen.getByText('04')).toBeInTheDocument();

        expect(screen.getAllByRole('article')).toHaveLength(4);
    });

    it('renders custom principles passed via props', () => {
        renderWithUser(<HowIWork principles={customPrinciples} />);

        expect(screen.getByRole('heading', { level: 3, name: 'Clarity over cleverness' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 3, name: 'Automated safety nets' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { level: 3, name: 'Product first' })).not.toBeInTheDocument();

        expect(screen.getByText('01')).toBeInTheDocument();
        expect(screen.getByText('02')).toBeInTheDocument();
        expect(screen.queryByText('03')).not.toBeInTheDocument();

        expect(screen.getAllByRole('article')).toHaveLength(2);
    });

    it('renders accessible fallback message when principles list is empty', () => {
        renderWithUser(<HowIWork principles={[]} />);

        expect(screen.queryByRole('article')).not.toBeInTheDocument();
        expect(screen.getByText('Principles will be published soon.')).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
        const { container } = renderWithUser(<HowIWork className="custom-principles-class" />);

        expect(container.firstChild).toHaveClass('custom-principles-class');
    });

    it('applies custom className to empty state container', () => {
        const { container } = renderWithUser(<HowIWork principles={[]} className="custom-empty-class" />);

        expect(container.firstChild).toHaveClass('custom-empty-class');
    });
});
