import { afterEach, describe, expect, it } from 'vitest';
import gsap from 'gsap';
import { buildAmbientTimeline, buildDayNightTimeline } from './timeline';
import { AMBIENT_DESKTOP, AMBIENT_MOBILE, DAY_NIGHT_DURATION, ENV, envSelector } from './environment.constants';

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
                <g data-env="${ENV.cloud}"></g>
                <g data-env="${ENV.cloud}"></g>
            </g>
            <g data-env="${ENV.fieldNight}"></g>
            <path data-env="${ENV.blade}"></path>
            <path data-env="${ENV.blade}"></path>
        </svg>
        <div data-env="${ENV.scrimNight}"></div>
    `;
    document.body.appendChild(scope);
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

        expect(clouds).toHaveLength(2);
        for (const cloud of clouds) {
            expect(cloud.repeat()).toBe(-1);
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
