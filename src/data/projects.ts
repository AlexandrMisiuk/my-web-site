import type { Project } from './types';

export const projects: readonly Project[] = [
    {
        id: 'zahara',
        title: 'Zahara',
        status: 'shipped',
        summary:
            'A cloud-based Purchase-to-Pay platform covering procurement, approval workflows, invoice processing, payments, and financial integrations. I owned frontend architecture across the product, modernizing a large Angular codebase while working across core procurement workflows, cloud integrations, and the mobile application.',
        technologies: [
            'TypeScript',
            'Angular',
            'RxJS',
            'NgRx',
            'Angular Material',
            'Expo',
            'React Native',
            'REST APIs',
            '.NET',
            'C#',
            'NSwag',
            'SignalR',
            'WebSocket',
        ],
        media: {
            kind: 'image',
            src: '/projects/zahara.png',
            alt: 'Zahara procurement platform',
            width: 890,
            height: 500,
        },
        externalUrl: 'https://www.zaharasoftware.com/',
    },

    {
        id: 'family-budget',
        title: 'Family Budget',
        status: 'building',
        summary:
            'A local-first budgeting app built around shared finances, reliable calculations, and keeping things simple.',
        technologies: ['Flutter', 'Dart', 'Android', 'iOS', 'SQLite', 'Firebase'],
        media: {
            kind: 'image',
            src: '/projects/family-budget.jpeg',
            alt: 'Family Budget application',
            width: 1376,
            height: 768,
        },
    },

    {
        id: 'browser-calls',
        title: 'Browser Calls',
        status: 'building',
        summary:
            'A small WebRTC experiment exploring peer-to-peer audio, signaling, and what it takes to make browsers talk directly.',
        technologies: ['Angular', 'TypeScript', 'WebRTC', 'Node.js', 'WebSocket'],
        media: {
            kind: 'image',
            src: '/projects/browser-call-tool.jpeg',
            alt: 'Browser-to-browser audio calling',
            width: 1408,
            height: 768,
        },
    },
] as const;
