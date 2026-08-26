import { describe, expect, it } from 'vitest';
import { render, screen } from '@/test/render';
import { Eyebrow } from './Eyebrow';
import {
    ArrowRightIcon,
    ArrowUpRightIcon,
    CloseIcon,
    DocumentIcon,
    GitHubIcon,
    LinkedInIcon,
    MailIcon,
    MenuIcon,
    MoonIcon,
    SunIcon,
} from './icons';
import { Tag } from './Tag';

describe('Tag', () => {
    it('renders its children as a note', () => {
        render(<Tag>TypeScript</Tag>);
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });
});

describe('Eyebrow', () => {
    it('renders children as a paragraph by default and honours the as prop', () => {
        const { rerender } = render(<Eyebrow>01 / Work</Eyebrow>);
        expect(screen.getByText('01 / Work').tagName).toBe('P');

        rerender(<Eyebrow as="h2">Section</Eyebrow>);
        expect(screen.getByRole('heading', { level: 2, name: 'Section' })).toBeInTheDocument();
    });
});

describe('icons', () => {
    it.each([
        ['Sun', SunIcon],
        ['Moon', MoonIcon],
        ['Arrow up right', ArrowUpRightIcon],
        ['Arrow right', ArrowRightIcon],
        ['Mail', MailIcon],
        ['Document', DocumentIcon],
        ['GitHub', GitHubIcon],
        ['LinkedIn', LinkedInIcon],
        ['Menu', MenuIcon],
        ['Close', CloseIcon],
    ] as const)('renders the %s icon as a decorative svg that accepts a label override', (_name, Icon) => {
        const { rerender } = render(<Icon />);
        expect(document.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');

        rerender(<Icon size={32} role="img" aria-label={`${_name} icon`} aria-hidden={false} />);
        const icon = screen.getByRole('img', { name: `${_name} icon` });
        expect(icon).toHaveAttribute('width', '32');
        expect(icon).toHaveAttribute('height', '32');
    });
});
