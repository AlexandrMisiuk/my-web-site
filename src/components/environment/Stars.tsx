import { ENV, STAR_COUNT, STAR_SEED } from './environment.constants';
import { createStarField } from './starField';

// Generated once at module scope: the field is deterministic, so it never
// needs to be recomputed on render.
const STARS = createStarField(STAR_COUNT, STAR_SEED);

export function Stars() {
    return (
        <g data-env={ENV.starField} className="env-night-layer">
            {STARS.map((star) => (
                <circle
                    key={star.id}
                    data-env={ENV.star}
                    cx={star.x}
                    cy={star.y}
                    r={star.radius}
                    fill="#f2f5ff"
                    opacity={star.opacity}
                />
            ))}
        </g>
    );
}
