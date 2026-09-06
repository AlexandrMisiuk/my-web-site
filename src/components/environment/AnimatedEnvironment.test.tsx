/* eslint-disable testing-library/no-container, testing-library/no-node-access --
   The animated environment is decorative `aria-hidden` SVG. It is deliberately
   absent from the accessibility tree, so role- and label-based queries cannot
   reach it; its `data-env` animation hooks are the only stable handles. */
import { afterEach, describe, expect, it } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import gsap from 'gsap';
import { AnimatedEnvironment } from './AnimatedEnvironment';
import { ENV, envSelector } from './environment.constants';
import { AMBIENT_CONDITIONS, REDUCED_MOTION_QUERY } from './motion';
import { setMediaMatches } from '../../test/matchMedia';

function armMotion(breakpoint: 'full' | 'lite' | 'none'): void {
    setMediaMatches(REDUCED_MOTION_QUERY, breakpoint === 'none');
    setMediaMatches(AMBIENT_CONDITIONS.full, breakpoint === 'full');
    setMediaMatches(AMBIENT_CONDITIONS.lite, breakpoint === 'lite');
}

function advance(seconds: number): void {
    gsap.globalTimeline.seek(gsap.globalTimeline.time() + seconds);
}

function swayingBlades(container: HTMLElement): number {
    return [...container.querySelectorAll(envSelector(ENV.blade))].filter(
        (blade) => Number(gsap.getProperty(blade, 'rotation')) !== 0,
    ).length;
}

function opacityOf(container: HTMLElement, part: string): number {
    return Number(gsap.getProperty(container.querySelector(envSelector(part))!, 'opacity'));
}

afterEach(() => {
    gsap.killTweensOf('*');
});

describe('AnimatedEnvironment', () => {
    it('is a decorative, non-interactive layer', () => {
        armMotion('full');
        const { container } = render(<AnimatedEnvironment />);
        const layer = container.querySelector(envSelector(ENV.layer))!;

        expect(layer).toHaveAttribute('aria-hidden', 'true');
        expect(layer.className).toContain('pointer-events-none');
    });

    it('assembles the whole scene', () => {
        armMotion('full');
        const { container } = render(<AnimatedEnvironment />);

        for (const part of [ENV.skyDay, ENV.sunGroup, ENV.moonGroup, ENV.starField, ENV.cloudBand, ENV.scrimNight]) {
            expect(container.querySelector(envSelector(part))).not.toBeNull();
        }
    });

    it('opens on a full day when the document is light', () => {
        armMotion('full');
        const { container } = render(<AnimatedEnvironment />);

        expect(opacityOf(container, ENV.skyDay)).toBeCloseTo(1, 2);
        expect(opacityOf(container, ENV.starField)).toBeCloseTo(0, 2);
    });

    it('opens already at night, with no transition, when the document is dark', () => {
        armMotion('full');
        document.documentElement.setAttribute('data-theme', 'dark');

        const { container } = render(<AnimatedEnvironment />);

        expect(opacityOf(container, ENV.starField)).toBeCloseTo(1, 2);
        expect(opacityOf(container, ENV.skyDay)).toBeCloseTo(0, 2);
    });

    it('runs the sunset when the document switches to dark', async () => {
        armMotion('full');
        const { container } = render(<AnimatedEnvironment />);

        document.documentElement.setAttribute('data-theme', 'dark');

        await waitFor(() => expect(opacityOf(container, ENV.skyDay)).toBeLessThan(1));
        advance(5);
        expect(opacityOf(container, ENV.starField)).toBeCloseTo(1, 1);
        expect(opacityOf(container, ENV.moonGroup)).toBeCloseTo(1, 1);
    });

    it('runs the sunrise when the document switches back to light', async () => {
        armMotion('full');
        document.documentElement.setAttribute('data-theme', 'dark');
        const { container } = render(<AnimatedEnvironment />);

        document.documentElement.setAttribute('data-theme', 'light');

        await waitFor(() => expect(opacityOf(container, ENV.starField)).toBeLessThan(1));
        advance(5);
        expect(opacityOf(container, ENV.starField)).toBeCloseTo(0, 1);
        expect(opacityOf(container, ENV.skyDay)).toBeCloseTo(1, 1);
    });

    it('changes state instantly and animates nothing under reduced motion', async () => {
        armMotion('none');
        const { container } = render(<AnimatedEnvironment />);

        document.documentElement.setAttribute('data-theme', 'dark');

        await waitFor(() => expect(opacityOf(container, ENV.starField)).toBeCloseTo(1, 2));
        advance(6);
        expect(swayingBlades(container)).toBe(0);
    });

    it('returns to day instantly under reduced motion', async () => {
        armMotion('none');
        document.documentElement.setAttribute('data-theme', 'dark');
        const { container } = render(<AnimatedEnvironment />);

        document.documentElement.setAttribute('data-theme', 'light');

        await waitFor(() => expect(opacityOf(container, ENV.starField)).toBeCloseTo(0, 2));
        expect(opacityOf(container, ENV.skyDay)).toBeCloseTo(1, 2);
    });

    it('sways the grass on the desktop ambient budget', () => {
        armMotion('full');
        const { container } = render(<AnimatedEnvironment />);

        advance(6);

        expect(swayingBlades(container)).toBeGreaterThan(0);
    });

    it('drops the grass sway on the reduced mobile ambient budget', () => {
        armMotion('lite');
        const { container } = render(<AnimatedEnvironment />);

        advance(6);

        expect(swayingBlades(container)).toBe(0);
    });

    it('drifts the clouds on both ambient budgets', () => {
        armMotion('lite');
        const { container } = render(<AnimatedEnvironment />);
        const cloud = container.querySelector(envSelector(ENV.cloud))!;

        advance(4);

        expect(Number(gsap.getProperty(cloud, 'x'))).not.toBe(0);
    });

    it('tears every animation down on unmount', () => {
        armMotion('full');
        const { container, unmount } = render(<AnimatedEnvironment />);
        const cloud = container.querySelector(envSelector(ENV.cloud))!;

        unmount();

        expect(gsap.isTweening(cloud)).toBe(false);
    });

    it('accepts an extra className', () => {
        armMotion('full');
        const { container } = render(<AnimatedEnvironment className="custom-env" />);

        expect(container.querySelector(envSelector(ENV.layer))!.className).toContain('custom-env');
    });
});
