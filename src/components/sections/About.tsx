import { aboutContent as defaultAboutContent } from '@/data/about';
import type { AboutContent } from '@/data/types';

export interface AboutProps {
    content?: AboutContent;
    className?: string;
}

export function About({ content = defaultAboutContent, className = '' }: AboutProps) {
    if (!content.paragraphs || content.paragraphs.length === 0) {
        return (
            <div
                className={`border-hairline rounded-[var(--radius-sm)] border border-dashed p-8 text-center sm:p-12 ${className}`.trim()}
            >
                <p className="text-body text-ink-muted">Biography will be published soon.</p>
            </div>
        );
    }

    return (
        <div
            className={`text-body text-ink-muted max-w-[62ch] space-y-4 leading-relaxed sm:space-y-6 ${className}`.trim()}
        >
            {content.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
        </div>
    );
}
