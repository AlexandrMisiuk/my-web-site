import { ENV } from './environment.constants';

/** Hand-placed drift bands: near clouds sit lower and read larger. */
const CLOUDS = [
    { id: 0, x: 120, y: 168, scale: 1.15 },
    { id: 1, x: 520, y: 116, scale: 0.8 },
    { id: 2, x: 880, y: 210, scale: 1 },
    { id: 3, x: 1240, y: 132, scale: 0.9 },
    { id: 4, x: 1480, y: 254, scale: 1.25 },
    { id: 5, x: 300, y: 300, scale: 0.7 },
] as const;

export function Clouds() {
    return (
        <g data-env={ENV.cloudBand}>
            {CLOUDS.map((cloud) => (
                <g key={cloud.id} data-env={ENV.cloud} transform={`translate(${cloud.x} ${cloud.y})`}>
                    <g transform={`scale(${cloud.scale})`} fill="#ffffff" opacity="0.72">
                        <ellipse cx="0" cy="0" rx="92" ry="26" />
                        <ellipse cx="-46" cy="6" rx="58" ry="19" />
                        <ellipse cx="40" cy="8" rx="66" ry="21" />
                        <ellipse cx="-8" cy="-16" rx="52" ry="24" />
                    </g>
                </g>
            ))}
        </g>
    );
}
