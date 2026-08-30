import { describe, expect, it } from 'vitest';
import { render, screen } from '@/test/render';
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
} from './index';

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
        const { rerender } = render(<Icon className="custom-icon" />);
        const svg = document.querySelector('svg');
        expect(svg).toHaveAttribute('aria-hidden', 'true');
        expect(svg).toHaveClass('custom-icon');

        rerender(<Icon size={32} role="img" aria-label={`${_name} icon`} aria-hidden={false} />);
        const icon = screen.getByRole('img', { name: `${_name} icon` });
        expect(icon).toHaveAttribute('width', '32');
        expect(icon).toHaveAttribute('height', '32');
    });
});
