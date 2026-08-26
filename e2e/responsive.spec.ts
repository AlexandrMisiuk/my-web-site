import { expect, test, type Locator } from '@playwright/test';

async function assertMinTarget(locator: Locator, size = 44): Promise<void> {
    await expect(locator).toBeVisible();
    const box = await locator.boundingBox();
    expect(box, 'control should have a bounding box').not.toBeNull();
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(size);
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(size);
}

test.describe('responsive layout', () => {
    test('does not overflow the viewport horizontally', async ({ page }) => {
        await page.goto('/');

        const metrics = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
        }));

        expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
    });

    test('the theme toggle meets a 44px tap target', async ({ page }) => {
        await page.goto('/');
        const toggle = page.getByRole('button', { name: 'Toggle color scheme' });
        await expect(toggle).toBeVisible();
        await assertMinTarget(toggle);
    });

    test('the hamburger meets a 44px tap target below md', async ({ page, viewport }) => {
        test.skip((viewport?.width ?? 0) >= 768, 'hamburger is md:hidden');
        await page.goto('/');
        const hamburger = page.getByRole('button', { name: 'Open menu' });
        await expect(hamburger).toBeVisible();
        await assertMinTarget(hamburger);
    });

    test('desktop primary nav links meet the WCAG 2.5.8 24px target', async ({ page, viewport }) => {
        test.skip((viewport?.width ?? 0) < 768, 'Primary nav is visible from the md breakpoint up');
        await page.goto('/');

        const navLinks = page.getByRole('navigation', { name: 'Primary' }).getByRole('link');
        await expect(navLinks.first()).toBeVisible();
        const count = await navLinks.count();
        for (let index = 0; index < count; index += 1) {
            await assertMinTarget(navLinks.nth(index), 24);
        }
    });

    test('footer action links meet a 44px tap target', async ({ page }) => {
        await page.goto('/');

        const footerLinks = page.getByRole('contentinfo').getByRole('link');
        await expect(footerLinks.first()).toBeVisible();
        const footerCount = await footerLinks.count();
        for (let index = 0; index < footerCount; index += 1) {
            await assertMinTarget(footerLinks.nth(index));
        }
    });

    test('IndexRail is absent from the layout below xl', async ({ page, viewport }) => {
        test.skip((viewport?.width ?? 0) >= 1280, 'IndexRail appears at the xl breakpoint');
        await page.goto('/');
        await expect(page.getByRole('complementary', { includeHidden: true })).toBeHidden();
    });

    test('IndexRail does not intercept pointer events at 1440', async ({ page, viewport }) => {
        test.skip((viewport?.width ?? 0) < 1280, 'IndexRail is display:none below xl');
        await page.goto('/');
        const rail = page.getByRole('complementary', { includeHidden: true });
        await expect(rail).toBeVisible();
        await expect(rail).toHaveCSS('pointer-events', 'none');
    });
});
