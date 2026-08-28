import { describe, expect, it } from 'vitest';
import type { Project } from '@/data/types';
import { renderWithUser, screen } from '@/test/render';
import { SelectedWork } from './SelectedWork';

const customProjects: readonly Project[] = [
    {
        id: 'project-one',
        title: 'Project Alpha',
        status: 'shipped',
        summary: 'First test project summary description.',
        technologies: ['React', 'TypeScript'],
    },
    {
        id: 'project-two',
        title: 'Project Beta',
        status: 'building',
        summary: 'Second test project summary description.',
        technologies: ['Vite', 'Tailwind CSS'],
    },
];

describe('SelectedWork', () => {
    it('renders default projects from projects data module when no prop is provided', () => {
        renderWithUser(<SelectedWork />);

        expect(screen.getByRole('heading', { level: 3, name: 'Personal Product' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 3, name: 'Enterprise Web Platform' })).toBeInTheDocument();
        expect(screen.getAllByRole('article')).toHaveLength(2);
    });

    it('renders custom projects passed via the projects prop', () => {
        renderWithUser(<SelectedWork projects={customProjects} />);

        expect(screen.getByRole('heading', { level: 3, name: 'Project Alpha' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 3, name: 'Project Beta' })).toBeInTheDocument();
        expect(screen.getAllByRole('article')).toHaveLength(2);
    });

    it('renders accessible fallback message when projects list is empty', () => {
        renderWithUser(<SelectedWork projects={[]} />);

        expect(screen.queryByRole('article')).not.toBeInTheDocument();
        expect(screen.getByText('Featured case studies and projects will be published soon.')).toBeInTheDocument();
    });
});
