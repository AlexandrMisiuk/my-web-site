import { useState } from 'react';
import { TechIcon } from '@/components/ui/icons/TechIcon';
import { TECHNOLOGY_CATEGORIES as defaultCategories, technologies as defaultTechnologies } from '@/data/technologies';
import type { TechnologyCategory, TechnologyCategoryOption, TechnologyItem } from '@/data/types';

export interface TechnologiesProps {
    technologies?: readonly TechnologyItem[];
    categories?: readonly TechnologyCategoryOption[];
    className?: string;
}

export function Technologies({
    technologies = defaultTechnologies,
    categories = defaultCategories,
    className = '',
}: TechnologiesProps) {
    const [selectedCategory, setSelectedCategory] = useState<'all' | TechnologyCategory>('all');

    if (technologies.length === 0) {
        return (
            <div
                className={`border-hairline rounded-sm border border-dashed p-8 text-center sm:p-12 ${className}`.trim()}
            >
                <p className="text-body text-ink-muted">Technologies list will be published soon.</p>
            </div>
        );
    }

    const filteredTechnologies =
        selectedCategory === 'all' ? technologies : technologies.filter((tech) => tech.category === selectedCategory);

    return (
        <div className={`flex flex-col gap-6 sm:gap-8 ${className}`.trim()}>
            <div
                role="tablist"
                aria-label="Technology categories"
                className="flex flex-wrap items-center gap-2 sm:gap-2.5"
            >
                {categories.map((category) => {
                    const isSelected = selectedCategory === category.id;
                    return (
                        <button
                            key={category.id}
                            role="tab"
                            type="button"
                            aria-selected={isSelected}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`focus-visible:ring-accent cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-150 focus-visible:ring-2 focus-visible:outline-none sm:px-4 sm:py-2 sm:text-sm ${
                                isSelected
                                    ? 'border-ink bg-ink text-canvas font-semibold shadow-xs'
                                    : 'border-hairline bg-surface text-ink-muted hover:border-ink-muted hover:text-ink'
                            }`.trim()}
                        >
                            {category.label}
                        </button>
                    );
                })}
            </div>

            {filteredTechnologies.length === 0 ? (
                <div className="border-hairline rounded-sm border border-dashed p-8 text-center sm:p-12">
                    <p className="text-body text-ink-muted">No technologies found in this category.</p>
                </div>
            ) : (
                <ul
                    aria-label="Technologies list"
                    className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                >
                    {filteredTechnologies.map((tech) => (
                        <li key={tech.id} className="h-full">
                            <article className="group border-hairline bg-surface hover:border-accent flex h-full flex-col items-center justify-center gap-3 rounded-sm border p-4 text-center transition-all duration-200 hover:-translate-y-0.5 sm:p-5">
                                <div className="flex h-10 w-10 items-center justify-center transition-transform duration-200 group-hover:scale-110">
                                    <TechIcon name={tech.icon} size={32} />
                                </div>
                                <span className="text-mono-xs sm:text-body text-ink font-mono font-medium tracking-tight">
                                    {tech.name}
                                </span>
                            </article>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
