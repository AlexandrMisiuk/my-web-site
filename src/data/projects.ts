import type { Project } from './types';

export const projects: readonly Project[] = [
    {
        id: 'personal-product',
        title: 'Personal Product',
        status: 'building',
        summary:
            'A modern web application built with a focus on performance, intuitive developer ergonomics, and fluid user interactions.',
        technologies: ['TypeScript', 'React', 'Tailwind CSS', 'Vite'],
        // media: {
        //     kind: 'image',
        //     src: '/projects/personal-product.webp',
        //     alt: 'Personal product dashboard preview',
        //     width: 1200,
        //     height: 750,
        // },
        // externalUrl: 'https://example.com',
        // repoUrl: 'https://github.com/example/repo',
    },
    {
        id: 'enterprise-web-platform',
        title: 'Enterprise Web Platform',
        status: 'placeholder',
        summary:
            'Architecture and frontend implementation for high-throughput enterprise SaaS applications, managing complex state and asynchronous workflows.',
        technologies: ['React', 'TypeScript', 'RxJS', 'REST APIs'],
        // media: {
        //     kind: 'image',
        //     src: '/projects/enterprise-platform.webp',
        //     alt: 'Enterprise platform case study preview',
        //     width: 1200,
        //     height: 750,
        // },
        // caseStudyUrl: '/work/enterprise-platform',
    },
] as const;
