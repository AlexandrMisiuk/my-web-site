import { BLADE_COUNT, BLADE_SEED, ENV } from './environment.constants';
import { createBladeField } from './bladeField';

const BLADES = createBladeField(BLADE_COUNT, BLADE_SEED);

/** Three rolling ridges, authored once and re-coloured for night. */
const RIDGES = [
    'M0 648 C 260 592 430 636 700 606 C 980 574 1200 634 1600 592 L1600 900 L0 900 Z',
    'M0 722 C 300 668 520 712 860 680 C 1180 650 1360 700 1600 668 L1600 900 L0 900 Z',
    'M0 796 C 340 752 640 792 980 762 C 1280 736 1440 772 1600 750 L1600 900 L0 900 Z',
] as const;

const DAY_FILLS = ['#8fc97a', '#74b664', '#5aa252'] as const;
const NIGHT_FILLS = ['#18202c', '#111823', '#0b1018'] as const;

function bladePath(lean: number, height: number): string {
    return `M0 0 Q ${lean * 0.35} ${-height * 0.62} ${lean} ${-height}`;
}

export function Landscape() {
    return (
        <>
            <g>
                {RIDGES.map((d, index) => (
                    <path key={d} d={d} fill={DAY_FILLS[index]} />
                ))}
                {BLADES.map((blade) => (
                    // Each blade is its own translate group, so GSAP rotates it
                    // about its own root without measuring anything.
                    <g key={blade.id} data-env={ENV.blade} transform={`translate(${blade.x} ${blade.baseY})`}>
                        <path
                            d={bladePath(blade.lean, blade.height)}
                            stroke="#46873f"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            fill="none"
                            opacity="0.42"
                        />
                    </g>
                ))}
            </g>
            {/* Pre-darkened duplicate: night is an opacity cross-fade, never a
                filter tween. */}
            <g data-env={ENV.fieldNight} className="env-night-layer">
                {RIDGES.map((d, index) => (
                    <path key={d} d={d} fill={NIGHT_FILLS[index]} />
                ))}
            </g>
        </>
    );
}
