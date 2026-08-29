import { projects as defaultProjects } from '@/data/projects';
import type { Project } from '@/data/types';
import { ProjectCard } from './ProjectCard';

export interface SelectedWorkProps {
    projects?: readonly Project[];
    className?: string;
}

export function SelectedWork({ projects = defaultProjects, className = '' }: SelectedWorkProps) {
    if (projects.length === 0) {
        return (
            <div
                className={`border-hairline rounded-sm border border-dashed p-8 text-center sm:p-12 ${className}`.trim()}
            >
                <p className="text-body text-ink-muted">Featured case studies and projects will be published soon.</p>
            </div>
        );
    }

    return (
        <div className={`space-y-12 sm:space-y-16 ${className}`.trim()}>
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    );
}
