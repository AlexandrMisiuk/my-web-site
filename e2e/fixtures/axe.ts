import { test as base } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

type AxeFixtures = {
    makeAxeBuilder: () => AxeBuilder;
};

export const test = base.extend<AxeFixtures>({
    makeAxeBuilder: async ({ page }, use) => {
        await use(() =>
            new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
                .exclude('[aria-hidden="true"]'),
        );
    },
});

export { expect } from '@playwright/test';
