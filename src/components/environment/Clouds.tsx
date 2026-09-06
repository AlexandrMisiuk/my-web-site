import { ENV } from './environment.constants';
import { CLOUDS } from './cloudField';

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
