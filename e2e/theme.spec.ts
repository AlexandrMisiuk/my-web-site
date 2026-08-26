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
});

test.describe('pre-paint dark preference', () => {
    test.use({ colorScheme: 'dark' });

    test('applies data-theme=dark on first paint without a flash to light', async ({ page }) => {
        await page.goto('/');

        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
        await expect(page.getByRole('button', { name: 'Toggle color scheme' })).toHaveAttribute('aria-pressed', 'true');
    });
});
