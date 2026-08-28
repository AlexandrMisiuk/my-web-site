import { describe, expect, it } from 'vitest';
import type { Project } from '@/data/types';
import { renderWithUser, screen, within } from '@/test/render';
import { ProjectCard } from './ProjectCard';

const baseProject: Project = {
    id: 'test-project',
    title: 'Modern Analytics Engine',
    status: 'building',
    summary: 'High-performance real-time telemetry processing pipeline.',
    technologies: ['TypeScript', 'React', 'Tailwind CSS', 'Vite'],
};

describe('ProjectCard', () => {
    it('renders semantic article landmark with accessible title association', () => {
        renderWithUser(<ProjectCard project={baseProject} />);

        const article = screen.getByRole('article');
        expect(article).toHaveAttribute('aria-labelledby', 'test-project-title');

        const heading = screen.getByRole('heading', { level: 3, name: 'Modern Analytics Engine' });
        expect(heading).toHaveAttribute('id', 'test-project-title');

        expect(screen.getByText('High-performance real-time telemetry processing pipeline.')).toBeInTheDocument();
    });

    it('renders all technology tags', () => {
        renderWithUser(<ProjectCard project={baseProject} />);

        for (const tech of baseProject.technologies) {
            expect(screen.getByText(tech)).toBeInTheDocument();
        }
    });

    it('handles projects without technologies gracefully', () => {
        const noTechProject: Project = {
            ...baseProject,
            technologies: [],
        };

        renderWithUser(<ProjectCard project={noTechProject} />);
        expect(screen.getByRole('heading', { level: 3, name: 'Modern Analytics Engine' })).toBeInTheDocument();
    });

    describe('status badge mapping', () => {
        it('renders In Progress for building status', () => {
            renderWithUser(<ProjectCard project={{ ...baseProject, status: 'building' }} />);
            expect(screen.getByText('In Progress')).toBeInTheDocument();
        });

        it('renders Shipped for shipped status', () => {
            renderWithUser(<ProjectCard project={{ ...baseProject, status: 'shipped' }} />);
            expect(screen.getByText('Shipped')).toBeInTheDocument();
        });

        it('renders Architecture / Concept for placeholder status', () => {
            renderWithUser(<ProjectCard project={{ ...baseProject, status: 'placeholder' }} />);
            expect(screen.getByText('Architecture / Concept')).toBeInTheDocument();
        });
    });

    describe('media handling', () => {
        it('renders image media with explicit dimensions and async lazy loading attributes', () => {
            const projectWithImage: Project = {
                ...baseProject,
                media: {
                    kind: 'image',
                    src: '/projects/analytics-preview.webp',
                    alt: 'Analytics dashboard overview screenshot',
                    width: 1200,
                    height: 750,
                },
            };

            renderWithUser(<ProjectCard project={projectWithImage} />);

            const image = screen.getByRole('img', { name: 'Analytics dashboard overview screenshot' });
            expect(image).toHaveAttribute('src', '/projects/analytics-preview.webp');
            expect(image).toHaveAttribute('width', '1200');
            expect(image).toHaveAttribute('height', '750');
            expect(image).toHaveAttribute('loading', 'lazy');
            expect(image).toHaveAttribute('decoding', 'async');
        });

        it('renders video media with poster, dimensions, and controls', () => {
            const projectWithVideo: Project = {
                ...baseProject,
                media: {
                    kind: 'video',
                    src: '/projects/demo.mp4',
                    poster: '/projects/demo-poster.webp',
                    alt: 'Product workflow demonstration',
                    width: 1280,
                    height: 720,
                },
            };

            renderWithUser(<ProjectCard project={projectWithVideo} />);

            const video = screen.getByLabelText('Product workflow demonstration');
            expect(video).toBeInTheDocument();
            expect(video.tagName.toLowerCase()).toBe('video');
            expect(video).toHaveAttribute('src', '/projects/demo.mp4');
            expect(video).toHaveAttribute('poster', '/projects/demo-poster.webp');
            expect(video).toHaveAttribute('width', '1280');
            expect(video).toHaveAttribute('height', '720');
            expect(video).toHaveAttribute('preload', 'none');
            expect(video).toHaveAttribute('controls');
        });

        it('renders cleanly without media element when media is omitted', () => {
            renderWithUser(<ProjectCard project={baseProject} />);

            expect(screen.queryByRole('img')).not.toBeInTheDocument();
            expect(screen.queryByLabelText('Product workflow demonstration')).not.toBeInTheDocument();
        });
    });

    describe('action links', () => {
        it('renders Live Demo, GitHub, and Case Study links when supplied', () => {
            const fullyLinkedProject: Project = {
                ...baseProject,
                externalUrl: 'https://demo.example.com',
                repoUrl: 'https://github.com/example/analytics',
                caseStudyUrl: '/work/analytics',
            };

            renderWithUser(<ProjectCard project={fullyLinkedProject} />);

            const liveDemoLink = screen.getByRole('link', { name: /Live Demo/i });
            expect(liveDemoLink).toHaveAttribute('href', 'https://demo.example.com');
            expect(liveDemoLink).toHaveAttribute('target', '_blank');

            const githubLink = screen.getByRole('link', { name: /GitHub/i });
            expect(githubLink).toHaveAttribute('href', 'https://github.com/example/analytics');

            const caseStudyLink = screen.getByRole('link', { name: 'Case Study' });
            expect(caseStudyLink).toHaveAttribute('href', '/work/analytics');
        });

        it('omits individual links when unsupplied or empty', () => {
            const partiallyLinkedProject: Project = {
                ...baseProject,
                externalUrl: '',
                repoUrl: 'https://github.com/example/analytics',
                caseStudyUrl: undefined,
            };

            renderWithUser(<ProjectCard project={partiallyLinkedProject} />);

            expect(screen.queryByRole('link', { name: /Live Demo/i })).not.toBeInTheDocument();
            expect(screen.queryByRole('link', { name: 'Case Study' })).not.toBeInTheDocument();
            expect(screen.getByRole('link', { name: /GitHub/i })).toHaveAttribute(
                'href',
                'https://github.com/example/analytics',
            );
        });

        it('renders only Live Demo when other URLs are missing', () => {
            const liveOnlyProject: Project = {
                ...baseProject,
                externalUrl: 'https://demo.example.com',
                repoUrl: '',
                caseStudyUrl: '',
            };

            renderWithUser(<ProjectCard project={liveOnlyProject} />);

            expect(screen.getByRole('link', { name: /Live Demo/i })).toBeInTheDocument();
            expect(screen.queryByRole('link', { name: /GitHub/i })).not.toBeInTheDocument();
            expect(screen.queryByRole('link', { name: 'Case Study' })).not.toBeInTheDocument();
        });

        it('renders only Case Study when other URLs are missing', () => {
            const caseOnlyProject: Project = {
                ...baseProject,
                externalUrl: '',
                repoUrl: '',
                caseStudyUrl: '/work/analytics',
            };

            renderWithUser(<ProjectCard project={caseOnlyProject} />);

            expect(screen.queryByRole('link', { name: /Live Demo/i })).not.toBeInTheDocument();
            expect(screen.queryByRole('link', { name: /GitHub/i })).not.toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'Case Study' })).toBeInTheDocument();
        });

        it('omits the action links row entirely when no valid URLs are provided', () => {
            const noLinksProject: Project = {
                ...baseProject,
                externalUrl: '',
                repoUrl: '',
                caseStudyUrl: '',
            };

            renderWithUser(<ProjectCard project={noLinksProject} />);

            const article = screen.getByRole('article');
            expect(within(article).queryByRole('link')).not.toBeInTheDocument();
        });
    });
});
