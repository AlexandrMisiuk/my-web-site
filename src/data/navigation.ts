import type { NavItem } from './types';

export const navItems: readonly NavItem[] = [
    { id: 'work', label: 'Selected Work' },
    { id: 'how-i-work', label: 'How I Work' },
    { id: 'about', label: 'About' },
    { id: 'technologies', label: 'Technologies' },
    { id: 'contact', label: 'Contact' },
] as const;

export const SECTION_IDS = ['hero', 'work', 'how-i-work', 'about', 'technologies', 'contact'] as const;
