import type { Principle } from './types';

export const principles: readonly Principle[] = [
    {
        id: 'product-first',
        title: 'Product first',
        body: 'Technology serves the user and the business. I prioritize user workflows, delivery velocity, and measurable outcomes before optimizing architecture.',
    },
    {
        id: 'thoughtful-architecture',
        title: 'Thoughtful architecture',
        body: 'Simple abstractions, explicit contracts, and minimal dependencies outlive complex frameworks. I design maintainable systems that teams can evolve with confidence.',
    },
    {
        id: 'details-matter',
        title: 'Details matter',
        body: 'Polish is not an afterthought. Typography rhythm, layout stability, sub-millisecond interaction feedback, and WCAG AA accessibility define software quality.',
    },
    {
        id: 'ownership',
        title: 'Ownership',
        body: 'Senior engineering means end-to-end accountability — from early product discovery and architectural trade-offs to production monitoring and clear documentation.',
    },
] as const;
