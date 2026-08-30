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
