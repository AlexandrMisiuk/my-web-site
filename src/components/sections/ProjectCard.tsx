import { ActionLink } from '@/components/ui/ActionLink';
import { StatusPill, type StatusPillColor } from '@/components/ui/StatusPill';
import { Tag } from '@/components/ui/Tag';
import type { Project, ProjectStatus } from '@/data/types';

export interface ProjectCardProps {
    project: Project;
    className?: string;
}

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: StatusPillColor }> = {
    building: {
        label: 'In Progress',
        color: 'amber',
    },
    shipped: {
        label: 'Shipped',
        color: 'emerald',
    },
    placeholder: {
        label: 'Architecture / Concept',
        color: 'accent',
    },
};

export function ProjectCard({ project, className = '' }: ProjectCardProps) {
    const statusInfo = STATUS_CONFIG[project.status];
    const hasLiveDemo = Boolean(project.externalUrl);
    const hasRepo = Boolean(project.repoUrl);
    const hasCaseStudy = Boolean(project.caseStudyUrl);
    const hasAnyLink = hasLiveDemo || hasRepo || hasCaseStudy;

    return (
        <article
            aria-labelledby={`${project.id}-title`}
            className={`group border-hairline bg-surface flex flex-col gap-6 rounded-[var(--radius-sm)] border p-6 transition-colors sm:p-8 ${className}`.trim()}
        >
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 id={`${project.id}-title`} className="text-h3 text-ink font-semibold tracking-tight">
                    {project.title}
                </h3>
                <StatusPill color={statusInfo.color} variant="canvas" size="sm">
                    {statusInfo.label}
                </StatusPill>
            </div>

            <p className="text-body text-ink-muted">{project.summary}</p>

            {project.technologies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                        <Tag key={tech}>{tech}</Tag>
                    ))}
                </div>
            ) : null}

            {project.media ? (
                <div className="border-hairline bg-canvas aspect-[16/10] overflow-hidden rounded-[var(--radius-sm)] border sm:aspect-[16/9]">
                    {project.media.kind === 'image' ? (
                        <img
                            src={project.media.src}
                            alt={project.media.alt}
                            width={project.media.width}
                            height={project.media.height}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <video
                            src={project.media.src}
                            poster={project.media.poster}
                            width={project.media.width}
                            height={project.media.height}
                            preload="none"
                            controls
                            aria-label={project.media.alt}
                            className="h-full w-full object-cover"
                        >
                            <track kind="captions" />
                        </video>
                    )}
                </div>
            ) : null}

            {hasAnyLink ? (
                <div className="flex flex-wrap items-center gap-3 pt-2">
                    {hasLiveDemo ? (
                        <ActionLink href={project.externalUrl} variant="ghost" isExternal>
                            Live Demo
                        </ActionLink>
                    ) : null}
                    {hasRepo ? (
                        <ActionLink href={project.repoUrl} variant="ghost" isExternal>
                            GitHub
                        </ActionLink>
                    ) : null}
                    {hasCaseStudy ? (
                        <ActionLink href={project.caseStudyUrl} variant="primary">
                            Case Study
                        </ActionLink>
                    ) : null}
                </div>
            ) : null}
        </article>
    );
}
