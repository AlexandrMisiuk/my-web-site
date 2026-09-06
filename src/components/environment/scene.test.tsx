/* eslint-disable testing-library/no-container, testing-library/no-node-access --
   The animated environment is decorative `aria-hidden` SVG. It is deliberately
   absent from the accessibility tree, so role- and label-based queries cannot
   reach it; its `data-env` animation hooks are the only stable handles. */
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Clouds } from './Clouds';
import { Landscape } from './Landscape';
import { Moon } from './Moon';
import { Scrim } from './Scrim';
import { Sky } from './Sky';
import { Stars } from './Stars';
import { Sun } from './Sun';
import {
    BLADE_COUNT,
    ENV,
    STAR_COUNT,
    SUN_CORE_RADIUS,
    SUN_GLOW_PEAK_SCALE,
    SUN_GLOW_RADIUS,
    SUN_VIEWBOX,
    envSelector,
} from './environment.constants';
import { CLOUDS } from './cloudField';

function renderSvg(node: React.ReactElement) {
    return render(<svg viewBox="0 0 1600 900">{node}</svg>);
}

function countOf(container: HTMLElement, part: string): number {
    return container.querySelectorAll(envSelector(part)).length;
}

describe('Sky', () => {
    it('stacks the day, dusk and night gradient layers', () => {
        const { container } = render(<Sky />);

        expect(countOf(container, ENV.skyDay)).toBe(1);
        expect(countOf(container, ENV.skyDusk)).toBe(1);
        expect(countOf(container, ENV.skyNight)).toBe(1);
    });
});

describe('Sun', () => {
    it('wraps a glow and a core inside a single viewport-positioned box', () => {
        const { container } = render(<Sun />);
        const group = container.querySelector(envSelector(ENV.sunGroup));

        expect(group).not.toBeNull();
        expect(group!.querySelector(envSelector(ENV.sunGlow))).not.toBeNull();
        expect(group!.querySelector(envSelector(ENV.sunCore))).not.toBeNull();
    });
});

describe('Sun glow headroom', () => {
    it('keeps the glow inside its own viewBox at peak swell', () => {
        // The sunset scales the glow up. If the scaled radius reaches past the
        // SVG viewport the browser clips it to the viewport, and the sun rises
        // and sets inside a visible square.
        expect(SUN_GLOW_RADIUS * SUN_GLOW_PEAK_SCALE).toBeLessThanOrEqual(SUN_VIEWBOX / 2);
    });

    it('leaves the core well clear of the edge', () => {
        expect(SUN_CORE_RADIUS).toBeLessThan(SUN_GLOW_RADIUS);
    });
});

describe('Moon', () => {
    it('renders a single viewport-positioned box', () => {
        const { container } = render(<Moon />);

        expect(countOf(container, ENV.moonGroup)).toBe(1);
    });
});

describe('Stars', () => {
    it('renders the full star field inside one opacity group', () => {
        const { container } = renderSvg(<Stars />);
        const field = container.querySelector(envSelector(ENV.starField));

        expect(field).not.toBeNull();
        expect(field!.querySelectorAll(envSelector(ENV.star))).toHaveLength(STAR_COUNT);
    });

    it('places identical stars on every render', () => {
        const first = renderSvg(<Stars />).container.innerHTML;
        const second = renderSvg(<Stars />).container.innerHTML;

        expect(first).toEqual(second);
    });
});

describe('Clouds', () => {
    it('renders every cloud inside one opacity band', () => {
        const { container } = renderSvg(<Clouds />);
        const band = container.querySelector(envSelector(ENV.cloudBand));

        expect(band).not.toBeNull();
        expect(band!.querySelectorAll(envSelector(ENV.cloud))).toHaveLength(CLOUDS.length);
    });

    it('starts every cloud inside the sky at its authored position', () => {
        const { container } = renderSvg(<Clouds />);
        const rendered = [...container.querySelectorAll(envSelector(ENV.cloud))];

        rendered.forEach((cloud, index) => {
            expect(cloud.getAttribute('transform')).toBe(`translate(${CLOUDS[index].x} ${CLOUDS[index].y})`);
        });
    });
});

describe('Landscape', () => {
    it('renders the grass and a pre-darkened night layer to cross-fade against', () => {
        const { container } = renderSvg(<Landscape />);

        expect(countOf(container, ENV.blade)).toBe(BLADE_COUNT);
        expect(countOf(container, ENV.fieldNight)).toBe(1);
    });
});

describe('Scrim', () => {
    it('renders the night readability overlay', () => {
        const { container } = render(<Scrim />);

        expect(countOf(container, ENV.scrimNight)).toBe(1);
    });
});
