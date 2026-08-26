import React, { useEffect, useRef } from 'react';
import { Container } from '@/components/layout/Container';
import { ActionLink } from '@/components/ui/ActionLink';
import { navItems } from '@/data/navigation';
import { siteProfile } from '@/data/site';

export interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
    activeId: string;
    triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export function MobileNav({ isOpen, onClose, activeId, triggerRef }: MobileNavProps) {
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const panel = panelRef.current;
        /* v8 ignore next -- the dialog ref is attached before this effect runs */
        if (!panel) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const focusables = panel.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length > 0) {
            focusables[0].focus();
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
                return;
            }

            if (e.key === 'Tab') {
                const tabbables = panel.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
                );
                if (tabbables.length === 0) {
                    e.preventDefault();
                    return;
                }

                const firstElement = tabbables[0];
                const lastElement = tabbables[tabbables.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };

        const mql = window.matchMedia('(min-width: 48rem)');
        const handleMediaChange = (e: MediaQueryListEvent) => {
            if (e.matches) {
                onClose();
            }
        };

        if (mql.matches) {
            onClose();
        }

        mql.addEventListener('change', handleMediaChange);
        document.addEventListener('keydown', handleKeyDown);

        const trigger = triggerRef.current;

        return () => {
            document.body.style.overflow = previousOverflow;
            mql.removeEventListener('change', handleMediaChange);
            document.removeEventListener('keydown', handleKeyDown);
            if (trigger) {
                trigger.focus();
            }
        };
    }, [isOpen, onClose, triggerRef]);

    if (!isOpen) return null;

    return (
        <div
            ref={panelRef}
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="bg-canvas fixed inset-x-0 top-(--header-height) z-40 flex h-(--mobile-nav-height) flex-col justify-between overflow-y-auto p-6 md:hidden"
        >
            <Container className="flex h-full flex-col justify-between py-6">
                <nav aria-label="Mobile Primary">
                    <ul className="flex flex-col gap-2">
                        {navItems.map((item) => {
                            const isActive = activeId === item.id;
                            return (
                                <li key={item.id} className="border-hairline/60 border-b py-2">
                                    <a
                                        href={`#${item.id}`}
                                        onClick={onClose}
                                        aria-current={isActive ? 'true' : undefined}
                                        className={`flex min-h-11 items-center gap-4 text-[32px] transition-colors ${
                                            isActive ? 'text-accent font-semibold' : 'text-ink-muted hover:text-ink'
                                        }`}
                                    >
                                        <span className="text-mono-xs font-mono">{item.index}</span>
                                        <span>{item.label}</span>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="border-hairline flex flex-col gap-4 border-t pt-6">
                    {siteProfile.links.cv ? (
                        <ActionLink
                            href={siteProfile.links.cv}
                            variant="ghost"
                            download
                            onClick={onClose}
                            className="w-full justify-center"
                        >
                            Download CV
                        </ActionLink>
                    ) : null}
                </div>
            </Container>
        </div>
    );
}
