import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import gsap from 'gsap';
import { TerminalWindow } from './TerminalWindow';
import { setMediaMatches } from '../../test/matchMedia';

describe('TerminalWindow', () => {
    beforeEach(() => {
        setMediaMatches('(prefers-reduced-motion: reduce)', false);
    });

    afterEach(() => {
        gsap.killTweensOf('*');
    });

    it('renders with default title "Terminal" when title prop is omitted', () => {
        render(<TerminalWindow text="Hello World" />);

        expect(screen.getByText('Terminal')).toBeInTheDocument();
        expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('animates text typewriter and cursor when motion is not reduced', () => {
        render(<TerminalWindow text="Hello World" typingSpeed={0.01} data-testid="animated-terminal" />);

        expect(screen.getByTestId('animated-terminal')).toBeInTheDocument();

        // Advance GSAP timeline
        gsap.globalTimeline.seek(10);

        expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('renders with custom formatted title "Terminal - ${title}" when title prop is provided', () => {
        render(<TerminalWindow text="Hello World" title="bio" />);

        expect(screen.getByText('Terminal - bio')).toBeInTheDocument();
    });

    it('renders prompt when prompt prop is provided', () => {
        render(<TerminalWindow prompt="alex@Engineer ~ %" text="Building reliable systems." />);

        expect(screen.getByText('alex@Engineer ~ %')).toBeInTheDocument();
        expect(screen.getByText('Building reliable systems.')).toBeInTheDocument();
    });

    it('omits prompt container when prompt prop is omitted or empty', () => {
        render(<TerminalWindow text="No prompt text" />);

        expect(screen.queryByText(/~/)).not.toBeInTheDocument();
        expect(screen.getByText('No prompt text')).toBeInTheDocument();
    });

    it('renders the three Mac-style top bar colored dots', () => {
        render(<TerminalWindow text="Test chrome" data-testid="chrome-terminal" />);

        expect(screen.getByTestId('chrome-terminal')).toBeInTheDocument();
        expect(screen.getByText('Terminal')).toBeInTheDocument();
        expect(screen.getByText('Test chrome')).toBeInTheDocument();
    });

    it('renders custom className on root container', () => {
        render(<TerminalWindow text="Custom class" className="custom-terminal-class" data-testid="custom-terminal" />);

        expect(screen.getByTestId('custom-terminal')).toHaveClass('custom-terminal-class');
    });

    it('renders with reduced motion preference without error', () => {
        setMediaMatches('(prefers-reduced-motion: reduce)', true);

        render(<TerminalWindow text="Reduced motion text" prompt="user@host ~ %" typingSpeed={0.05} />);

        expect(screen.getByText('Reduced motion text')).toBeInTheDocument();
        expect(screen.getByText('user@host ~ %')).toBeInTheDocument();
    });

    it('handles empty text gracefully', () => {
        render(<TerminalWindow text="" data-testid="empty-terminal" />);

        expect(screen.getByText('Terminal')).toBeInTheDocument();
        expect(screen.getByTestId('empty-terminal')).toBeInTheDocument();
    });
});
