import type { Principle } from './types';

export const principles: readonly Principle[] = [
    {
        id: 'understand-first',
        title: 'Understand first',
        body: 'Before writing code, I want to understand the product, the users, and the constraints around it. Context usually leads to better decisions than jumping straight into implementation.',
    },
    {
        id: 'plan-the-outcome',
        title: 'Plan before building',
        body: 'I start by defining the destination. I clarify the requirements, constraints, priorities, and expected outcome before choosing an implementation. Breaking a complex problem into deliberate steps helps reduce uncertainty, avoid unnecessary work, and keep the team moving in the same direction.',
    },
    {
        id: 'keep-it-simple',
        title: 'Keep it simple',
        body: 'I prefer straightforward solutions over clever ones. Clear boundaries, explicit contracts, strong typing, and a small number of well-understood abstractions make software easier to change and maintain.',
    },
    {
        id: 'improve-what-exists',
        title: 'Improve what exists',
        body: 'Most real products are not built from scratch. I am comfortable working with legacy code, technical debt, and systems that have evolved over years. I look for pragmatic improvements rather than rewriting everything.',
    },
    {
        id: 'care-about-details',
        title: 'Care about details',
        body: 'Quality lives in the details: predictable interactions, stable layouts, accessible interfaces, useful error states, performance, and code that another developer can understand six months later.',
    },
    {
        id: 'own-the-outcome',
        title: 'Own the outcome',
        body: 'I do not see my responsibility as ending when the pull request is merged. I care about the decision behind the implementation, how it behaves in production, and whether it actually solves the problem we started with.',
    },
] as const;
