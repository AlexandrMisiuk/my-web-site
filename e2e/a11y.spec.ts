import { expect, test } from './fixtures/axe';

test.describe('accessibility', () => {
    test.describe('light theme', () => {
        test.use({ colorScheme: 'light' });

        test('has no WCAG 2.1 AA violations on the landing page', async ({ page, makeAxeBuilder }) => {
            await page.goto('/');
            const results = await makeAxeBuilder().analyze();
            expect(results.violations).toEqual([]);
        });
    });

    test.describe('dark theme', () => {
        test.use({ colorScheme: 'dark' });

        test('has no WCAG 2.1 AA violations in dark scheme', async ({ page, makeAxeBuilder }) => {
            await page.goto('/');
            await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
            const results = await makeAxeBuilder().analyze();
            expect(results.violations).toEqual([]);
        });
    });

    test('has no WCAG 2.1 AA violations with the mobile nav open', async ({ page, makeAxeBuilder, viewport }) => {
        test.skip((viewport?.width ?? 0) >= 768, 'mobile nav is only openable below md');

        await page.goto('/');
        await page.getByRole('button', { name: 'Open menu' }).click();
        await expect(page.getByRole('dialog', { name: 'Navigation menu' })).toBeVisible();

        const results = await makeAxeBuilder().analyze();
        expect(results.violations).toEqual([]);
    });
});
