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
                className={`border-hairline rounded-sm border border-dashed p-8 text-center sm:p-12 ${className}`.trim()}
            >
                <p className="text-body text-ink-muted">Biography will be published soon.</p>
            </div>
        );
    }

    return (
        <div
            className={`border-hairline bg-surface/75 flex flex-col gap-4 rounded-sm border p-6 backdrop-blur-sm transition-colors sm:gap-6 sm:p-8 ${className}`.trim()}
        >
            {content.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-body text-ink-muted max-w-[62ch] leading-relaxed">
                    {paragraph}
                </p>
            ))}
        </div>
    );
}
