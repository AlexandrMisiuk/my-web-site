import { expect, test } from '@playwright/test';

const layer = '[data-env="layer"]';
const starField = '[data-env="star-field"]';

test.describe('animated environment', () => {
    test('renders exactly one decorative, non-interactive layer', async ({ page }) => {
        await page.goto('/');
        const environment = page.locator(layer);

        await expect(environment).toHaveCount(1);
        await expect(environment).toHaveAttribute('aria-hidden', 'true');
        await expect(environment).toHaveCSS('pointer-events', 'none');
    });

    test('sits behind the content without intercepting clicks', async ({ page }) => {
        await page.goto('/');

        // Would time out with a pointer-interception error if the fixed layer
        // were painting above the content.
        await page.getByRole('link', { name: 'View Work' }).click();

        await expect(page).toHaveURL(/#work$/);
    });

    test('holds the night pose while the document is dark', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Toggle color scheme' }).click();
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

        // Reduced motion is forced for the whole e2e suite, so the state change
        // is instant and the night layers must already be at full strength.
        await expect(page.locator(starField)).toHaveCSS('opacity', '1');
    });

    test('returns to the day pose when the document goes light again', async ({ page }) => {
        await page.goto('/');
        const toggle = page.getByRole('button', { name: 'Toggle color scheme' });

        await toggle.click();
        await toggle.click();

        await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'dark');
        await expect(page.locator(starField)).toHaveCSS('opacity', '0');
    });

    test('keeps the hero terminal readable over the scene', async ({ page }) => {
        await page.goto('/');

        await expect(page.getByText('alex ~ %')).toBeVisible();
    });
});

/**
 * Ambient motion is disabled by the suite-wide `reducedMotion: 'reduce'`, so
 * these cases opt back in. They cover what jsdom structurally cannot: jsdom
 * does not resolve SVG transform attributes, so GSAP no-ops there, while a real
 * browser folds a cloud's authored `translate(x y)` into the tween and makes
 * its `x` the absolute scene position.
 */
test.describe('cloud drift', () => {
    test.use({ contextOptions: { reducedMotion: 'no-preference' } });

    // Mirrors ENV_VIEWBOX_WIDTH and CLOUD_WRAP_MARGIN in environment.constants.ts.
    const SCENE_WIDTH = 1600;
    const MARGIN = 200;

    async function sampleClouds(page: import('@playwright/test').Page, frames: number) {
        return page.evaluate(async (frameCount) => {
            const clouds = Array.from(document.querySelectorAll('[data-env="cloud"]'));
            const tracks: { x: number; y: number }[][] = clouds.map(() => []);

            for (let frame = 0; frame < frameCount; frame += 1) {
                clouds.forEach((cloud, index) => {
                    const value = getComputedStyle(cloud).transform;
                    const matrix = new DOMMatrixReadOnly(value === 'none' ? '' : value);
                    tracks[index].push({ x: matrix.m41, y: matrix.m42 });
                });
                await new Promise((resolve) => requestAnimationFrame(resolve));
            }

            return tracks;
        }, frames);
    }

    test('keeps every cloud within one off-screen margin of the scene', async ({ page }) => {
        await page.goto('/');
        const tracks = await sampleClouds(page, 90);

        expect(tracks.length).toBeGreaterThan(0);
        for (const samples of tracks) {
            for (const { x } of samples) {
                expect(x).toBeGreaterThanOrEqual(-MARGIN - 1);
                expect(x).toBeLessThanOrEqual(SCENE_WIDTH + MARGIN + 1);
            }
        }
    });

    test('never jumps a cloud backwards while it is on screen', async ({ page }) => {
        await page.goto('/');
        const tracks = await sampleClouds(page, 90);

        for (const samples of tracks) {
            const backwardSteps = samples
                .slice(1)
                .map((sample, index) => ({ from: samples[index].x, to: sample.x }))
                .filter((step) => step.to < step.from);

            // A backward step is only legitimate once the cloud has left the
            // right edge; one starting on screen is the bubble-pop regression.
            expect(backwardSteps.filter((step) => step.from <= SCENE_WIDTH)).toEqual([]);
        }
    });

    test('holds each cloud at its authored altitude while it drifts', async ({ page }) => {
        await page.goto('/');
        const tracks = await sampleClouds(page, 60);

        for (const samples of tracks) {
            const altitudes = Array.from(new Set(samples.map(({ y }) => Math.round(y))));

            expect(altitudes).toHaveLength(1);
            expect(altitudes[0]).toBeGreaterThan(0);
        }
    });
});
