import { describe, expect, it } from 'vitest';
import { render, screen } from '@/test/render';
import { Tag } from './Tag';

describe('Tag', () => {
    it('renders its children as a note', () => {
        render(<Tag>TypeScript</Tag>);
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('forwards custom className and standard HTML attributes', () => {
        render(
            <Tag className="custom-tag" id="tag-item" data-testid="tag-badge">
                React
            </Tag>,
        );
        const tag = screen.getByTestId('tag-badge');
        expect(tag).toHaveAttribute('id', 'tag-item');
        expect(tag).toHaveClass('custom-tag');
        expect(tag).toHaveTextContent('React');
    });
});
