import { expect, test } from '@playwright/test';

test.describe('theme toggle', () => {
    test.use({ colorScheme: 'light' });

    test('clicking the toggle flips the document theme and pressed state', async ({ page }) => {
        await page.goto('/');
        const toggle = page.getByRole('button', { name: 'Toggle color scheme' });

        await expect(toggle).toHaveAttribute('aria-pressed', 'false');

        await toggle.click();

        await expect(toggle).toHaveAttribute('aria-pressed', 'true');
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    });

    test('the chosen theme survives a reload via sessionStorage', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Toggle color scheme' }).click();
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

        await page.reload();

        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
        await expect(page.getByRole('button', { name: 'Toggle color scheme' })).toHaveAttribute('aria-pressed', 'true');
    });

    test('a fresh context starts from the OS preference', async ({ browser }) => {
        const context = await browser.newContext({ colorScheme: 'light', reducedMotion: 'reduce' });
        const page = await context.newPage();

        await page.goto('/');

        await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'dark');
        await expect(page.getByRole('button', { name: 'Toggle color scheme' })).toHaveAttribute(
            'aria-pressed',
            'false',
        );
        await context.close();
    });

    test('hero section switches background image visibility on theme toggle', async ({ page }) => {
        await page.goto('/');

        const hero = page.locator('#hero');
        const heroBgImages = hero.locator('[aria-hidden="true"] img');
        await expect(heroBgImages).toHaveCount(2);

        const lightImage = heroBgImages.first();
        const darkImage = heroBgImages.nth(1);

        await expect(lightImage).toBeVisible();
        await expect(darkImage).toBeHidden();

        await page.getByRole('button', { name: 'Toggle color scheme' }).click();

        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
        await expect(lightImage).toBeHidden();
        await expect(darkImage).toBeVisible();
    });
});

test.describe('pre-paint dark preference', () => {
    test.use({ colorScheme: 'dark' });

    test('applies data-theme=dark on first paint without a flash to light', async ({ page }) => {
        await page.goto('/');

        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
        await expect(page.getByRole('button', { name: 'Toggle color scheme' })).toHaveAttribute('aria-pressed', 'true');
    });

    test('displays dark hero background image on first paint in dark scheme', async ({ page }) => {
        await page.goto('/');

        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
        const hero = page.locator('#hero');
        const heroBgImages = hero.locator('[aria-hidden="true"] img');
        await expect(heroBgImages.first()).toBeHidden();
        await expect(heroBgImages.nth(1)).toBeVisible();
    });
});
