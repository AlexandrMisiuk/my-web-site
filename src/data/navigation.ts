import type { NavItem } from './types';

export const navItems: readonly NavItem[] = [
    { id: 'work', label: 'Selected Work', index: '01' },
    { id: 'how-i-work', label: 'How I Work', index: '02' },
    { id: 'about', label: 'About', index: '03' },
    { id: 'technologies', label: 'Technologies', index: '04' },
    { id: 'contact', label: 'Contact', index: '05' },
] as const;

export const SECTION_IDS = ['hero', 'work', 'how-i-work', 'about', 'technologies', 'contact'] as const;
