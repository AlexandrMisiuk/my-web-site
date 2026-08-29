import { createRef, type ComponentProps } from 'react';
import { act, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { NavItem, SiteProfile } from '@/data/types';
import { mockMatchMedia, setMediaMatches } from '@/test/matchMedia';
import { renderWithUser, screen, within } from '@/test/render';
import { MobileNav } from './MobileNav';

const mockNavItems: readonly NavItem[] = [
    { id: 'work', label: 'Selected Work', index: '01' },
    { id: 'how-i-work', label: 'How I Work', index: '02' },
    { id: 'about', label: 'About', index: '03' },
    { id: 'technologies', label: 'Technologies', index: '04' },
    { id: 'contact', label: 'Contact', index: '05' },
];

const mockProfile: SiteProfile = {
    name: 'Alex Developer',
    role: 'Software Engineer',
    statement: 'Building software.',
    status: 'Available',
    links: {
        linkedin: 'https://linkedin.com/in/example',
        github: 'https://github.com/example',
        email: 'hello@example.com',
        cv: '/cv/test.pdf',
    },
};

function renderOpenNav(overrides?: Partial<ComponentProps<typeof MobileNav>>) {
    const triggerRef = createRef<HTMLButtonElement>();
    const onClose = vi.fn();
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.textContent = 'Open menu';
    document.body.append(trigger);
    triggerRef.current = trigger;

    const view = renderWithUser(
        <MobileNav
            isOpen
            onClose={onClose}
            activeId="work"
            triggerRef={triggerRef}
            items={mockNavItems}
            profile={mockProfile}
            {...overrides}
        />,
    );

    return { ...view, onClose, trigger, triggerRef };
}

describe('MobileNav', () => {
    it('renders nothing when closed', () => {
        const triggerRef = createRef<HTMLButtonElement>();
        renderWithUser(<MobileNav isOpen={false} onClose={vi.fn()} activeId="work" triggerRef={triggerRef} />);

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('exposes dialog semantics, focuses the first item, and locks body scroll', () => {
        document.body.style.overflow = 'auto';
        renderOpenNav();

        const dialog = screen.getByRole('dialog', { name: 'Navigation menu' });
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(within(dialog).getAllByRole('link')[0]).toHaveFocus();
        expect(document.body.style.overflow).toBe('hidden');
    });

    it('invokes onClose on Escape', async () => {
        const { user, onClose } = renderOpenNav();

        fireEvent.keyDown(document, { key: 'ArrowDown' });
        expect(onClose).not.toHaveBeenCalled();

        await user.keyboard('{Escape}');

        expect(onClose).toHaveBeenCalledOnce();
    });

    it('wraps Tab from the last focusable to the first and Shift+Tab in reverse', () => {
        renderOpenNav();
        const dialog = screen.getByRole('dialog');
        const links = within(dialog).getAllByRole('link');
        const first = links[0];
        const last = links[links.length - 1];

        last?.focus();
        fireEvent.keyDown(document, { key: 'Tab' });
        expect(first).toHaveFocus();

        first?.focus();
        fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
        expect(last).toHaveFocus();

        links[1]?.focus();
        fireEvent.keyDown(document, { key: 'Tab' });
        fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
        expect(links[1]).toHaveFocus();
    });

    it('does not throw Tab when the dialog has no focusable descendants', async () => {
        const { user } = renderOpenNav();
        const dialog = screen.getByRole('dialog');
        dialog.replaceChildren();

        await expect(user.keyboard('{Tab}')).resolves.toBeUndefined();
    });

    it('restores overflow and returns focus to the trigger on unmount', () => {
        document.body.style.overflow = 'scroll';
        const { unmount, trigger } = renderOpenNav();

        unmount();

        expect(document.body.style.overflow).toBe('scroll');
        expect(trigger).toHaveFocus();
    });

    it('does not throw on unmount when the trigger ref is empty', () => {
        const triggerRef = createRef<HTMLButtonElement>();
        const { unmount } = renderWithUser(
            <MobileNav isOpen onClose={vi.fn()} activeId="work" triggerRef={triggerRef} />,
        );

        expect(() => unmount()).not.toThrow();
    });

    it('closes when the viewport crosses 48rem and ignores a still-narrow change', () => {
        const { onClose } = renderOpenNav();

        act(() => {
            setMediaMatches('(min-width: 48rem)', false);
        });
        expect(onClose).not.toHaveBeenCalled();

        act(() => {
            setMediaMatches('(min-width: 48rem)', true);
        });
        expect(onClose).toHaveBeenCalledOnce();
    });

    it('closes immediately when already at a desktop width', () => {
        mockMatchMedia({ '(min-width: 48rem)': true });
        const { onClose } = renderOpenNav();

        expect(onClose).toHaveBeenCalledOnce();
    });

    it('renders the CV action inside the overlay when a cv link is provided', () => {
        renderOpenNav({
            profile: {
                ...mockProfile,
                links: { ...mockProfile.links, cv: '/cv/test.pdf' },
            },
        });

        expect(screen.getByRole('link', { name: 'Download CV' })).toHaveAttribute('href', '/cv/test.pdf');
    });

    it('omits the CV action inside the overlay when cv link is empty', () => {
        renderOpenNav({
            profile: {
                ...mockProfile,
                links: { ...mockProfile.links, cv: '' },
            },
        });

        expect(screen.queryByRole('link', { name: 'Download CV' })).not.toBeInTheDocument();
    });
});
