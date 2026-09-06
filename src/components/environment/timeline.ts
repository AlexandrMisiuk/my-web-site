import gsap from 'gsap';
import {
    CLOUD_BASE_DURATION,
    CLOUD_DURATION_STEP,
    CLOUD_NIGHT_OPACITY,
    CLOUD_WRAP_MARGIN,
    CLOUD_WRAP_SPAN,
    DAY_NIGHT_DURATION,
    ENV,
    ENV_VIEWBOX_WIDTH,
    MOON_RISE_TRAVEL,
    SUN_SET_DRIFT,
    SUN_GLOW_BASE_OPACITY,
    SUN_SET_TRAVEL,
    envSelector,
    type AmbientBudget,
} from './environment.constants';

/**
 * The day/night arc, as a single paused timeline.
 *
 * `progress(0)` is a full sunny day and `progress(1)` is a full night. Because
 * there is exactly one instance and the theme handler only ever calls
 * `play()` / `reverse()` on it, a theme flipped mid-transition simply reverses
 * from the current playhead — conflicting timelines cannot be created.
 */
export function buildDayNightTimeline(scope: HTMLElement): gsap.core.Timeline {
    const q = gsap.utils.selector(scope);

    // Pose the night-only layers before recording any start values. CSS hides
    // them too, so there is no flash before the first frame runs.
    gsap.set([q(envSelector(ENV.skyDusk)), q(envSelector(ENV.skyNight)), q(envSelector(ENV.starField))], {
        opacity: 0,
    });
    gsap.set([q(envSelector(ENV.moonGroup)), q(envSelector(ENV.fieldNight)), q(envSelector(ENV.scrimNight))], {
        opacity: 0,
    });
    gsap.set(q(envSelector(ENV.moonGroup)), { y: MOON_RISE_TRAVEL });
    gsap.set(q(envSelector(ENV.sunGlow)), { opacity: SUN_GLOW_BASE_OPACITY });

    const timeline = gsap.timeline({ paused: true, defaults: { ease: 'none' } });

    timeline
        // Sky: day drains while a warm dusk band swells, burns out, and hands
        // over to the night gradient. The peak is what reads as a sunset.
        .to(q(envSelector(ENV.skyDay)), { opacity: 0, duration: 1 }, 0)
        .to(q(envSelector(ENV.skyDusk)), { opacity: 1, duration: 0.45, ease: 'sine.out' }, 0)
        .to(q(envSelector(ENV.skyDusk)), { opacity: 0, duration: 0.55, ease: 'sine.in' }, 0.45)
        .to(q(envSelector(ENV.skyNight)), { opacity: 1, duration: 0.6 }, 0.4)
        // Sun: falls towards the ridge, glow swells then dies, disc snuffs out.
        .to(q(envSelector(ENV.sunGroup)), { y: SUN_SET_TRAVEL, x: SUN_SET_DRIFT, duration: 0.8, ease: 'power1.in' }, 0)
        .to(q(envSelector(ENV.sunGroup)), { opacity: 0, duration: 0.25 }, 0.55)
        .to(q(envSelector(ENV.sunGlow)), { opacity: 0.9, scale: 1.25, duration: 0.5, ease: 'sine.out' }, 0)
        .to(q(envSelector(ENV.sunGlow)), { opacity: 0, duration: 0.35 }, 0.6)
        // Landscape and readability scrim mute into the dark palette.
        .to(q(envSelector(ENV.fieldNight)), { opacity: 1, duration: 0.7 }, 0.25)
        .to(q(envSelector(ENV.scrimNight)), { opacity: 1, duration: 0.7 }, 0.3)
        .to(q(envSelector(ENV.cloudBand)), { opacity: CLOUD_NIGHT_OPACITY, duration: 0.6 }, 0.45)
        // Night sky arrives last: stars stagger in, then the moon rises.
        .to(
            q(envSelector(ENV.starField)),
            { opacity: 1, duration: 0.35, stagger: { each: 0.012, from: 'random' } },
            0.5,
        )
        .to(q(envSelector(ENV.moonGroup)), { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.55);

    // Authored in normalised units for readable position parameters, then
    // scaled once to the configured wall-clock length.
    return timeline.timeScale(timeline.duration() / DAY_NIGHT_DURATION);
}

/**
 * Continuous ambient motion.
 *
 * Every tween here targets a property the day/night timeline never touches —
 * where both need to affect one visual element they act on different DOM
 * levels (master on the wrapping group, ambient on the individual children).
 */
export function buildAmbientTimeline(scope: HTMLElement, budget: AmbientBudget): gsap.core.Timeline {
    const q = gsap.utils.selector(scope);
    const timeline = gsap.timeline();

    // Clouds drift in viewBox units and wrap seamlessly — no layout reads.
    //
    // GSAP folds a cloud's authored `transform="translate(x y)"` into its own
    // transform, so the tweened `x` IS the absolute scene position, not an
    // offset on top of it. The wrap window is therefore the same for every
    // cloud: the scene width plus one off-screen margin at each edge. Biasing
    // it by the authored x would shift each cloud's window by its own position
    // and pop it out of existence mid-sky.
    const minX = -CLOUD_WRAP_MARGIN;
    const maxX = ENV_VIEWBOX_WIDTH + CLOUD_WRAP_MARGIN;

    q(envSelector(ENV.cloud)).forEach((cloud, index) => {
        timeline.to(
            cloud,
            {
                x: `+=${CLOUD_WRAP_SPAN}`,
                duration: (CLOUD_BASE_DURATION + index * CLOUD_DURATION_STEP) * budget.cloudDurationScale,
                ease: 'none',
                repeat: -1,
                modifiers: {
                    x: gsap.utils.unitize((value: number) => gsap.utils.wrap(minX, maxX, value)),
                },
            },
            0,
        );
    });

    const blades = q(envSelector(ENV.blade)).slice(0, budget.swayingBlades);
    if (blades.length > 0) {
        timeline.to(
            blades,
            {
                rotation: 2.5,
                transformOrigin: 'bottom center',
                duration: 3.2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                stagger: { each: 0.15, from: 'random' },
            },
            0,
        );
    }

    const stars = q(envSelector(ENV.star)).slice(0, budget.twinklingStars);
    if (stars.length > 0) {
        timeline.to(
            stars,
            {
                opacity: 'random(0.25, 1)',
                duration: 'random(1.4, 3.2)',
                repeat: -1,
                repeatRefresh: true,
                yoyo: true,
                ease: 'sine.inOut',
                stagger: { each: 0.04, from: 'random' },
            },
            0,
        );
    }

    timeline.to(
        q(envSelector(ENV.sunCore)),
        { scale: 1.03, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: 'center' },
        0,
    );

    return timeline;
}
