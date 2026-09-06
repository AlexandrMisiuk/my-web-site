import { useCallback, useRef, type ReactElement } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Clouds } from './Clouds';
import { Landscape } from './Landscape';
import { Moon } from './Moon';
import { Scrim } from './Scrim';
import { Sky } from './Sky';
import { Stars } from './Stars';
import { Sun } from './Sun';
import { AMBIENT_DESKTOP, AMBIENT_MOBILE, ENV, ENV_VIEWBOX_HEIGHT, ENV_VIEWBOX_WIDTH } from './environment.constants';
import { AMBIENT_CONDITIONS, prefersReducedMotion } from './motion';
import { buildAmbientTimeline, buildDayNightTimeline } from './timeline';
import { readThemeAttribute, useThemeObserver } from '@/hooks/useThemeObserver';
import type { ColorScheme } from '@/hooks/useColorScheme';

gsap.registerPlugin(useGSAP);

export interface AnimatedEnvironmentProps {
    className?: string;
}

/**
 * A persistent landscape behind the whole site: a sunny field by day, the same
 * field under stars by night. The document's `data-theme` attribute is the
 * source of truth; GSAP owns the visual transition between the two states.
 */
export function AnimatedEnvironment({ className = '' }: AnimatedEnvironmentProps): ReactElement {
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<gsap.core.Timeline>(null);

    useGSAP(
        () => {
            const scope = containerRef.current!;
            const timeline = buildDayNightTimeline(scope);
            timelineRef.current = timeline;

            // Pose the scene for the current theme before anything is armed, so
            // the first paint never plays a sunset or a sunrise.
            timeline.progress(readThemeAttribute() === 'dark' ? 1 : 0).pause();

            // Ambient motion is armed separately. Under reduced motion neither
            // condition matches and the scene simply holds still.
            const media = gsap.matchMedia();
            media.add(AMBIENT_CONDITIONS, (context) => {
                const { full } = context.conditions as Record<keyof typeof AMBIENT_CONDITIONS, boolean>;
                buildAmbientTimeline(scope, full ? AMBIENT_DESKTOP : AMBIENT_MOBILE);
            });

            return () => {
                media.revert();
                timeline.kill();
            };
        },
        { scope: containerRef },
    );

    useThemeObserver(
        useCallback((theme: ColorScheme) => {
            const timeline = timelineRef.current!;

            if (prefersReducedMotion()) {
                timeline.progress(theme === 'dark' ? 1 : 0).pause();
                return;
            }

            // Reversing a running timeline resumes from the current playhead,
            // so toggling mid-sunset is graceful by construction.
            if (theme === 'dark') {
                timeline.play();
            } else {
                timeline.reverse();
            }
        }, []),
    );

    return (
        <div
            ref={containerRef}
            data-env={ENV.layer}
            aria-hidden="true"
            className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`.trim()}
        >
            <Sky />
            <svg
                viewBox={`0 0 ${ENV_VIEWBOX_WIDTH} ${ENV_VIEWBOX_HEIGHT}`}
                preserveAspectRatio="xMidYMax slice"
                className="absolute inset-0 h-full w-full"
                focusable="false"
            >
                <Stars />
            </svg>
            <Sun />
            <Moon />
            <svg
                viewBox={`0 0 ${ENV_VIEWBOX_WIDTH} ${ENV_VIEWBOX_HEIGHT}`}
                preserveAspectRatio="xMidYMax slice"
                className="absolute inset-0 h-full w-full"
                focusable="false"
            >
                <Clouds />
                <Landscape />
            </svg>
            <Scrim />
        </div>
    );
}
