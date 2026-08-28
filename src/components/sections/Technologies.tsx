import { Tag } from '@/components/ui/Tag';
import { technologies as defaultTechnologies } from '@/data/technologies';

export interface TechnologiesProps {
    technologies?: readonly string[];
    className?: string;
}

export function Technologies({ technologies = defaultTechnologies, className = '' }: TechnologiesProps) {
    if (technologies.length === 0) {
        return (
            <div
                className={`border-hairline rounded-[var(--radius-sm)] border border-dashed p-8 text-center sm:p-12 ${className}`.trim()}
            >
                <p className="text-body text-ink-muted">Technologies list will be published soon.</p>
            </div>
        );
    }

    return (
        <ul aria-label="Technologies and skills" className={`flex flex-wrap gap-2.5 sm:gap-3 ${className}`.trim()}>
            {technologies.map((tech) => (
                <li key={tech}>
                    <Tag>{tech}</Tag>
                </li>
            ))}
        </ul>
    );
}
