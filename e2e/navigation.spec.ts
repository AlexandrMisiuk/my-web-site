import { expect, test } from '@playwright/test';

const desktopNav = [
    { name: /selected work/i, hash: '#work', heading: 'Selected Work' },
    { name: /how i work/i, hash: '#how-i-work', heading: 'How I Work' },
    { name: /about/i, hash: '#about', heading: 'About' },
    { name: /technologies/i, hash: '#technologies', heading: 'Technologies' },
    { name: /contact/i, hash: '#contact', heading: 'Contact' },
] as const;

test.describe('navigation', () => {
    test('exposes a single h1 and the core landmarks', async ({ page }) => {
        await page.goto('/');

        await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
        await expect(page.getByRole('main')).toHaveAttribute('id', 'main');
        await expect(page.getByRole('contentinfo')).toBeVisible();
    });

    test('brand logo link is visible in header and points to #hero', async ({ page }) => {
        await page.goto('/');
        const brandLink = page.getByRole('banner').getByRole('link', { name: 'Oleksandr Misiuk' });
        await expect(brandLink).toBeVisible();
        await expect(brandLink).toHaveAttribute('href', '#hero');
        await expect(brandLink.locator('img')).toBeVisible();
    });

    test('desktop nav links update the hash and reveal the target heading', async ({ page, viewport }) => {
        test.skip((viewport?.width ?? 0) < 768, 'Primary nav is visible from the md breakpoint up');

        await page.goto('/');
        const nav = page.getByRole('navigation', { name: 'Primary' });

        for (const item of desktopNav) {
            await nav.getByRole('link', { name: item.name }).click();
            await expect(page).toHaveURL(new RegExp(`${item.hash}$`));

            const heading = page.getByRole('heading', { level: 2, name: item.heading });
            await expect(heading).toBeInViewport();
            const box = await heading.boundingBox();
            expect(box?.y ?? 0).toBeGreaterThanOrEqual(0);
        }
    });

    test('the last nav item is current after scrolling to the bottom of the page', async ({ page, viewport }) => {
        test.skip((viewport?.width ?? 0) < 768, 'Primary nav is visible from the md breakpoint up');

        await page.goto('/');
        await page.evaluate(() => {
            document.querySelectorAll('section').forEach((section) => {
                (section as HTMLElement).style.minHeight = '120vh';
            });
            window.scrollTo(0, document.documentElement.scrollHeight);
        });

        await expect(
            page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: /contact/i }),
        ).toHaveAttribute('aria-current', 'true');
    });

    test('the skip link is the first tab stop and moves focus to main', async ({ page }) => {
        await page.goto('/');
        await page.keyboard.press('Tab');

        const skip = page.getByRole('link', { name: 'Skip to main content' });
        await expect(skip).toBeFocused();

        await page.keyboard.press('Enter');
        await expect(page.locator('#main')).toBeFocused();
    });

    test('document head contains valid SVG favicon link and serves favicon.svg', async ({ page, request }) => {
        await page.goto('/');
        const favicon = page.locator('link[rel="icon"]');
        await expect(favicon).toHaveAttribute('type', 'image/svg+xml');
        await expect(favicon).toHaveAttribute('href', '/favicon.svg');

        const res = await request.get('/favicon.svg');
        expect(res.ok()).toBe(true);
        expect(res.headers()['content-type']).toContain('image/svg+xml');
        const svgBody = await res.text();
        expect(svgBody).toContain('<svg');
    });
});
