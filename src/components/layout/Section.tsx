import React from 'react';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/layout/SectionHeader';

export interface SectionProps {
    id: string;
    index?: string;
    label?: string;
    variant?: 'default' | 'plain';
    className?: string;
    children: React.ReactNode;
}

export function Section({ id, index, label, variant = 'default', className = '', children }: SectionProps) {
    const isPlain = variant === 'plain';

    return (
        <section
            id={id}
            aria-labelledby={!isPlain ? `${id}-heading` : undefined}
            className={`reveal py-section scroll-mt-(--header-height) ${className}`.trim()}
        >
            {isPlain ? (
                <Container>{children}</Container>
            ) : (
                <Container grid>
                    <div className="mb-8 lg:col-span-3 lg:mb-0">
                        {index && label && <SectionHeader index={index} label={label} headingId={`${id}-heading`} />}
                    </div>
                    <div className="lg:col-span-8 lg:col-start-5">{children}</div>
                </Container>
            )}
        </section>
    );
}
