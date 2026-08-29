import React from 'react';
import { Container } from '@/components/layout/Container';
import { SectionHeader } from '@/components/layout/SectionHeader';

export interface SectionProps {
    id: string;
    index?: string;
    label?: string;
    variant?: 'default' | 'plain';
    background?: React.ReactNode;
    className?: string;
    children: React.ReactNode;
}

export function Section({ id, index, label, variant = 'default', background, className = '', children }: SectionProps) {
    const isPlain = variant === 'plain';
    const sectionClass =
        `${background ? 'relative isolate ' : ''}reveal py-section scroll-mt-(--header-height) ${className}`.trim();

    return (
        <section id={id} aria-labelledby={!isPlain ? `${id}-heading` : undefined} className={sectionClass}>
            {background ? (
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    {background}
                </div>
            ) : null}
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

export interface SectionBackgroundProps {
    light: string;
    dark?: string;
    priority?: boolean;
}

export function SectionBackground({ light, dark, priority = false }: SectionBackgroundProps) {
    const loading = priority ? 'eager' : 'lazy';
    const fetchPriority = priority ? 'high' : 'auto';

    return (
        <>
            <img
                src={light}
                alt=""
                loading={loading}
                fetchPriority={fetchPriority}
                decoding="async"
                className={
                    dark
                        ? 'absolute inset-0 h-full w-full object-cover object-center opacity-50 dark:hidden'
                        : 'absolute inset-0 h-full w-full object-cover object-center opacity-50'
                }
            />
            {dark ? (
                <img
                    src={dark}
                    alt=""
                    loading={loading}
                    fetchPriority={fetchPriority}
                    decoding="async"
                    className="absolute inset-0 hidden h-full w-full object-cover object-center opacity-50 dark:block"
                />
            ) : null}
            <div className="from-canvas/75 via-canvas/20 to-canvas absolute inset-0 bg-linear-to-b" />
        </>
    );
}
