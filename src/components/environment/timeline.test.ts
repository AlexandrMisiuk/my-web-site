import { afterEach, describe, expect, it } from 'vitest';
import gsap from 'gsap';
import { buildAmbientTimeline, buildDayNightTimeline } from './timeline';
import { CLOUDS } from './cloudField';
import {
    AMBIENT_DESKTOP,
    AMBIENT_MOBILE,
    CLOUD_WRAP_MARGIN,
    DAY_NIGHT_DURATION,
    ENV,
    ENV_VIEWBOX_WIDTH,
    envSelector,
} from './environment.constants';

function createScene(): HTMLDivElement {
    const scope = document.createElement('div');
    scope.innerHTML = `
        <div data-env="${ENV.skyDay}"></div>
        <div data-env="${ENV.skyDusk}"></div>
        <div data-env="${ENV.skyNight}"></div>
        <div data-env="${ENV.sunGroup}">
            <svg viewBox="0 0 200 200">
                <circle data-env="${ENV.sunGlow}"></circle>
                <circle data-env="${ENV.sunCore}"></circle>
            </svg>
        </div>
        <div data-env="${ENV.moonGroup}"><svg viewBox="0 0 200 200"><circle></circle></svg></div>
        <svg viewBox="0 0 1600 900">
            <g data-env="${ENV.starField}">
                <circle data-env="${ENV.star}"></circle>
                <circle data-env="${ENV.star}"></circle>
                <circle data-env="${ENV.star}"></circle>
            </g>
            <g data-env="${ENV.cloudBand}">
                ${CLOUDS.map((cloud) => `<g data-env="${ENV.cloud}" transform="translate(${cloud.x} ${cloud.y})"></g>`).join('')}
            </g>
            <g data-env="${ENV.fieldNight}"></g>
            <path data-env="${ENV.blade}"></path>
            <path data-env="${ENV.blade}"></path>
        </svg>
        <div data-env="${ENV.scrimNight}"></div>
    `;
    document.body.appendChild(scope);

    // jsdom cannot resolve SVG transform attributes, so GSAP starts every cloud
    // at x=0 here. A real browser parses `translate(x y)` and folds it into the
    // tween, making GSAP's `x` the absolute scene position. Seed that explicitly
    // so the wrap window is exercised against the geometry the browser sees.
    CLOUDS.forEach((cloud, index) => {
        gsap.set(scope.querySelectorAll(envSelector(ENV.cloud))[index], { x: cloud.x });
    });

    return scope;
}

const ANIMATED_PROPS = ['opacity', 'x', 'y', 'scale', 'rotation'] as const;

function ownedProperties(timeline: gsap.core.Timeline): Set<string> {
    const owned = new Set<string>();

    for (const child of timeline.getChildren(true, true, false)) {
        const tween = child as gsap.core.Tween;
        const targets = tween.targets() as Element[];

        for (const prop of ANIMATED_PROPS) {
            if (!(prop in tween.vars)) continue;
            for (const target of targets) {
                owned.add(`${target.getAttribute('data-env')}:${prop}`);
            }
        }
    }

    return owned;
}

const CLOUD_SAMPLES = 200;

/**
 * Walks each cloud through one full drift cycle and reports its absolute scene
 * position (authored x plus the animated offset) at every sample.
 */
function sampleCloudPaths(
    scope: HTMLElement,
    timeline: gsap.core.Timeline,
): { authoredX: number; positions: number[] }[] {
    const tweens = timeline.getChildren(true, true, false) as gsap.core.Tween[];

    return [...scope.querySelectorAll(envSelector(ENV.cloud))].map((cloud, index) => {
        const tween = tweens.find((child) => (child.targets() as Element[])[0] === cloud)!;
        const positions: number[] = [];

        for (let step = 0; step <= CLOUD_SAMPLES; step += 1) {
            tween.progress(step / CLOUD_SAMPLES);
            // GSAP's x is the absolute scene position, not an offset.
            positions.push(Number(gsap.getProperty(cloud, 'x')));
        }

        return { authoredX: CLOUDS[index].x, positions };
    });
}

function opacityOf(scope: HTMLElement, part: string): number {
    return Number(gsap.getProperty(scope.querySelector(envSelector(part))!, 'opacity'));
}

afterEach(() => {
    gsap.killTweensOf('*');
    document.body.innerHTML = '';
});

describe('buildDayNightTimeline', () => {
    it('starts paused so the initial paint never animates', () => {
        const timeline = buildDayNightTimeline(createScene());

        expect(timeline.paused()).toBe(true);
        expect(timeline.progress()).toBe(0);
    });

    it('normalises the arc to the configured wall-clock duration', () => {
        const timeline = buildDayNightTimeline(createScene());

        expect(timeline.duration() / timeline.timeScale()).toBeCloseTo(DAY_NIGHT_DURATION, 5);
    });

    it('poses a full day at progress 0', () => {
        const scope = createScene();
        const timeline = buildDayNightTimeline(scope);

        timeline.progress(1).progress(0);

        expect(opacityOf(scope, ENV.skyDay)).toBeCloseTo(1, 2);
        expect(opacityOf(scope, ENV.skyNight)).toBeCloseTo(0, 2);
        expect(opacityOf(scope, ENV.starField)).toBeCloseTo(0, 2);
        expect(opacityOf(scope, ENV.moonGroup)).toBeCloseTo(0, 2);
        expect(opacityOf(scope, ENV.sunGroup)).toBeCloseTo(1, 2);
    });

    it('poses a full night at progress 1', () => {
        const scope = createScene();
        const timeline = buildDayNightTimeline(scope);

        timeline.progress(1);

        expect(opacityOf(scope, ENV.skyDay)).toBeCloseTo(0, 2);
        expect(opacityOf(scope, ENV.skyNight)).toBeCloseTo(1, 2);
        expect(opacityOf(scope, ENV.starField)).toBeCloseTo(1, 2);
        expect(opacityOf(scope, ENV.moonGroup)).toBeCloseTo(1, 2);
        expect(opacityOf(scope, ENV.sunGroup)).toBeCloseTo(0, 2);
        expect(opacityOf(scope, ENV.fieldNight)).toBeCloseTo(1, 2);
        expect(opacityOf(scope, ENV.scrimNight)).toBeCloseTo(1, 2);
    });

    it('burns the dusk band through a peak instead of a straight cross-fade', () => {
        const scope = createScene();
        const timeline = buildDayNightTimeline(scope);

        timeline.progress(0.45);
        const peak = opacityOf(scope, ENV.skyDusk);
        timeline.progress(1);
        const end = opacityOf(scope, ENV.skyDusk);

        expect(peak).toBeGreaterThan(0.8);
        expect(end).toBeCloseTo(0, 2);
    });

    it('sinks the sun below the horizon on the way to night', () => {
        const scope = createScene();
        const timeline = buildDayNightTimeline(scope);
        const sun = scope.querySelector(envSelector(ENV.sunGroup))!;

        timeline.progress(1);

        expect(Number(gsap.getProperty(sun, 'y'))).toBeGreaterThan(0);
    });
});

describe('buildAmbientTimeline', () => {
    it('drifts every cloud on an endless loop', () => {
        const scope = createScene();
        const timeline = buildAmbientTimeline(scope, AMBIENT_DESKTOP);
        const clouds = timeline
            .getChildren(true, true, false)
            .filter((child) => (child.targets() as Element[])[0]?.getAttribute('data-env') === ENV.cloud);

        expect(clouds).toHaveLength(CLOUDS.length);
        for (const cloud of clouds) {
            expect(cloud.repeat()).toBe(-1);
        }
    });

    it('carries every cloud clean across the sky and off both edges', () => {
        const scope = createScene();
        const timeline = buildAmbientTimeline(scope, AMBIENT_DESKTOP);

        for (const { authoredX, positions } of sampleCloudPaths(scope, timeline)) {
            // A cloud that only wandered mid-sky would never reach either edge.
            expect(Math.min(...positions)).toBeLessThanOrEqual(0);
            expect(Math.max(...positions)).toBeGreaterThanOrEqual(ENV_VIEWBOX_WIDTH);
            expect(authoredX).toBeGreaterThan(0);
        }
    });

    it('never teleports a cloud into the middle of the sky', () => {
        const scope = createScene();
        const timeline = buildAmbientTimeline(scope, AMBIENT_DESKTOP);

        for (const { positions } of sampleCloudPaths(scope, timeline)) {
            // Exactly one backward step per cycle: the wrap itself.
            const jumps = positions
                .slice(1)
                .map((value, index) => ({ from: positions[index], to: value }))
                .filter(({ from, to }) => to < from);

            expect(jumps).toHaveLength(1);
            expect(jumps[0].from).toBeGreaterThan(ENV_VIEWBOX_WIDTH);
            expect(jumps[0].to).toBeLessThan(0);
        }
    });

    it('keeps every cloud within one margin of the scene at all times', () => {
        const scope = createScene();
        const timeline = buildAmbientTimeline(scope, AMBIENT_DESKTOP);

        for (const { positions } of sampleCloudPaths(scope, timeline)) {
            for (const position of positions) {
                expect(position).toBeGreaterThanOrEqual(-CLOUD_WRAP_MARGIN - 1);
                expect(position).toBeLessThanOrEqual(ENV_VIEWBOX_WIDTH + CLOUD_WRAP_MARGIN + 1);
            }
        }
    });

    it('sways the grass on the desktop budget', () => {
        const scope = createScene();
        const timeline = buildAmbientTimeline(scope, AMBIENT_DESKTOP);

        expect(ownedProperties(timeline)).toContain(`${ENV.blade}:rotation`);
    });

    it('drops the grass sway on the reduced mobile budget', () => {
        const scope = createScene();
        const timeline = buildAmbientTimeline(scope, AMBIENT_MOBILE);

        expect(ownedProperties(timeline)).not.toContain(`${ENV.blade}:rotation`);
    });

    it('twinkles no more stars than the budget allows', () => {
        const scope = createScene();
        const timeline = buildAmbientTimeline(scope, { ...AMBIENT_MOBILE, twinklingStars: 1 });
        const twinkled = timeline
            .getChildren(true, true, false)
            .flatMap((child) => child.targets() as Element[])
            .filter((target) => target.getAttribute('data-env') === ENV.star);

        expect(twinkled).toHaveLength(1);
    });

    it('animates nothing when every budget is zero', () => {
        const scope = createScene();
        const timeline = buildAmbientTimeline(scope, { twinklingStars: 0, swayingBlades: 0, cloudDurationScale: 1 });

        expect(ownedProperties(timeline)).not.toContain(`${ENV.star}:opacity`);
        expect(ownedProperties(timeline)).not.toContain(`${ENV.blade}:rotation`);
    });

    it('slows cloud drift on the reduced mobile budget', () => {
        const desktop = buildAmbientTimeline(createScene(), AMBIENT_DESKTOP);
        const mobile = buildAmbientTimeline(createScene(), AMBIENT_MOBILE);
        const firstCloudDuration = (timeline: gsap.core.Timeline) =>
            timeline
                .getChildren(true, true, false)
                .find((child) => (child.targets() as Element[])[0]?.getAttribute('data-env') === ENV.cloud)!
                .duration();

        expect(firstCloudDuration(mobile)).toBeGreaterThan(firstCloudDuration(desktop));
    });
});

describe('timeline property ownership', () => {
    it('never lets the two timelines animate the same property of the same element', () => {
        const scope = createScene();
        const master = ownedProperties(buildDayNightTimeline(scope));
        const ambient = ownedProperties(buildAmbientTimeline(scope, AMBIENT_DESKTOP));
        const overlap = [...master].filter((entry) => ambient.has(entry));

        expect(master.size).toBeGreaterThan(0);
        expect(ambient.size).toBeGreaterThan(0);
        expect(overlap).toEqual([]);
    });
});
