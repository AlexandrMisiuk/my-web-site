export interface Cloud {
    id: number;
    x: number;
    y: number;
    scale: number;
}

/** Hand-placed drift bands: near clouds sit lower and read larger. */
export const CLOUDS: Cloud[] = [
    { id: 0, x: 120, y: 168, scale: 1.15 },
    { id: 1, x: 520, y: 116, scale: 0.8 },
    { id: 2, x: 880, y: 210, scale: 1 },
    { id: 3, x: 1240, y: 132, scale: 0.9 },
    { id: 4, x: 1480, y: 254, scale: 1.25 },
    { id: 5, x: 300, y: 300, scale: 0.7 },
];
