import { expect, test } from '@playwright/test';

test.describe('hamburger visibility', () => {
    test('is visible below the md breakpoint', async ({ page, viewport }) => {
        test.skip((viewport?.width ?? 0) >= 768, 'hamburger is md:hidden');
        await page.goto('/');
        await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
    });

    test('is hidden at md and above', async ({ page, viewport }) => {
        test.skip((viewport?.width ?? 0) < 768, 'desktop uses the primary nav instead');
        await page.goto('/');
        await expect(page.getByRole('button', { name: 'Open menu' })).toBeHidden();
    });
});

test.describe('mobile overlay', () => {
    test.beforeEach(({ viewport }) => {
        test.skip((viewport?.width ?? 0) >= 768, 'overlay behaviour is mobile-only');
    });

    test('opens the dialog, locks body scroll, and moves focus inside', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Open menu' }).click();

        const dialog = page.getByRole('dialog', { name: 'Navigation menu' });
        await expect(dialog).toBeVisible();
        await expect(dialog.getByRole('link').first()).toBeFocused();
        await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden');
    });

    test('Escape closes the overlay and returns focus to the trigger', async ({ page }) => {
        await page.goto('/');
        const trigger = page.getByRole('button', { name: 'Open menu' });
        await trigger.click();
        await expect(page.getByRole('dialog', { name: 'Navigation menu' })).toBeVisible();

        await page.keyboard.press('Escape');

        await expect(page.getByRole('dialog', { name: 'Navigation menu' })).toHaveCount(0);
        await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
    });

    test('selecting a nav item closes the overlay and updates the hash', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Open menu' }).click();

        await page.getByRole('dialog', { name: 'Navigation menu' }).getByRole('link', { name: /about/i }).click();

        await expect(page.getByRole('dialog', { name: 'Navigation menu' })).toHaveCount(0);
        await expect(page).toHaveURL(/#about$/);
    });

    test('widening past 768px while open auto-closes the overlay', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Open menu' }).click();
        await expect(page.getByRole('dialog', { name: 'Navigation menu' })).toBeVisible();

        await page.setViewportSize({ width: 800, height: 800 });

        await expect(page.getByRole('dialog', { name: 'Navigation menu' })).toHaveCount(0);
    });
});
