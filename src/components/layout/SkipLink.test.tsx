import { describe, expect, it } from 'vitest';
import { render, screen } from '@/test/render';
import { SkipLink } from './SkipLink';

describe('SkipLink', () => {
    it('targets #main by default and honours a custom target', () => {
        const { rerender } = render(<SkipLink />);
        expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute('href', '#main');

        rerender(<SkipLink targetId="work">Skip to work</SkipLink>);
        expect(screen.getByRole('link', { name: 'Skip to work' })).toHaveAttribute('href', '#work');
    });
});
