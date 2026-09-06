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
