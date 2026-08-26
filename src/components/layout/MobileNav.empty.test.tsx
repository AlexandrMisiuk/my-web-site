import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import { renderWithUser, screen } from '@/test/render';
import { MobileNav } from './MobileNav';

vi.mock('@/data/navigation', () => ({
    navItems: [],
}));

vi.mock('@/data/site', () => ({
    siteProfile: {
        name: 'Test',
        role: '',
        statement: '',
        status: '',
        links: { linkedin: '', github: '', email: '', cv: '' },
    },
}));

describe('MobileNav without focusable descendants', () => {
    it('opens without focusing and swallows Tab', () => {
        const triggerRef = createRef<HTMLButtonElement>();
        renderWithUser(<MobileNav isOpen onClose={vi.fn()} activeId="work" triggerRef={triggerRef} />);

        expect(screen.getByRole('dialog', { name: 'Navigation menu' })).toBeInTheDocument();
        expect(() => fireEvent.keyDown(document, { key: 'Tab' })).not.toThrow();
    });
});
