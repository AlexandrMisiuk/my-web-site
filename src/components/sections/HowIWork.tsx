import { principles as defaultPrinciples } from '@/data/principles';
import type { Principle } from '@/data/types';

export interface HowIWorkProps {
    principles?: readonly Principle[];
    className?: string;
}

export function HowIWork({ principles = defaultPrinciples, className = '' }: HowIWorkProps) {
    if (principles.length === 0) {
        return (
            <div
                className={`border-hairline rounded-sm border border-dashed p-8 text-center sm:p-12 ${className}`.trim()}
            >
                <p className="text-body text-ink-muted">Principles will be published soon.</p>
            </div>
        );
    }

    return (
        <div className={`grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10 ${className}`.trim()}>
            {principles.map((principle) => (
                <article
                    key={principle.id}
                    aria-labelledby={`${principle.id}-title`}
                    className="border-hairline bg-surface flex flex-col gap-3 rounded-sm border p-6 transition-colors sm:p-8"
                >
                    <h3 id={`${principle.id}-title`} className="text-h3 text-ink font-semibold tracking-tight">
                        {principle.title}
                    </h3>
                    <p className="text-body text-ink-muted leading-relaxed">{principle.body}</p>
                </article>
            ))}
        </div>
    );
}
