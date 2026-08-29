import { useState, useRef } from 'react';
import { Container } from '@/components/layout/Container';
import { MobileNav } from '@/components/layout/MobileNav';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { CloseIcon, MenuIcon } from '@/components/ui/icons';
import { navItems as defaultNavItems } from '@/data/navigation';
import { siteProfile as defaultProfile } from '@/data/site';
import type { NavItem, SiteProfile } from '@/data/types';

export interface HeaderProps {
    activeId: string;
    items?: readonly NavItem[];
    profile?: SiteProfile;
}

export function Header({ activeId, items = defaultNavItems, profile = defaultProfile }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="border-hairline bg-canvas/80 sticky top-0 z-50 h-(--header-height) border-b backdrop-blur-md">
            <Container as="div" className="flex h-full items-center justify-between">
                <a
                    href="#hero"
                    className="group text-ink hover:text-accent focus-visible:outline-accent flex items-center gap-2 font-mono text-sm font-semibold tracking-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                    <span>{profile.name}</span>
                </a>

                {/* Desktop navigation */}
                <nav aria-label="Primary" className="hidden items-center gap-6 md:flex lg:gap-8">
                    <ul className="flex items-center gap-6 lg:gap-8">
                        {items.map((item) => {
                            const isActive = activeId === item.id;
                            return (
                                <li key={item.id}>
                                    <a
                                        href={`#${item.id}`}
                                        aria-current={isActive ? 'true' : undefined}
                                        className={`group relative py-1 text-sm font-medium transition-colors ${
                                            isActive ? 'text-ink font-semibold' : 'text-ink-muted hover:text-ink'
                                        }`}
                                    >
                                        <span
                                            className={`text-mono-xs mr-1.5 font-mono transition-colors ${
                                                isActive
                                                    ? 'text-accent font-semibold'
                                                    : 'text-ink-muted group-hover:text-ink'
                                            }`}
                                        >
                                            {item.index}
                                        </span>
                                        <span>{item.label}</span>
                                        <span
                                            className={`absolute inset-x-0 -bottom-1 h-0.5 rounded-full transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-accent scale-x-100 opacity-100'
                                                    : 'bg-ink/30 group-hover:scale-x-100 group-hover:opacity-100 group-focus-visible:scale-x-100 group-focus-visible:opacity-100'
                                            }`}
                                        />
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Header actions: ThemeToggle + Hamburger */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <ThemeToggle />
                    <button
                        ref={triggerRef}
                        type="button"
                        onClick={toggleMenu}
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-nav"
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        className="text-ink-muted hover:border-hairline hover:bg-surface hover:text-ink focus-visible:outline-accent inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-transparent p-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 md:hidden"
                    >
                        {isMenuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
                    </button>
                </div>
            </Container>

            <MobileNav
                isOpen={isMenuOpen}
                onClose={closeMenu}
                activeId={activeId}
                triggerRef={triggerRef}
                items={items}
                profile={profile}
            />
        </header>
    );
}
