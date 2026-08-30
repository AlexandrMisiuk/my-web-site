import { useEffect, useRef, useState } from 'react';

export function useActiveSection(ids: readonly string[]): string {
    const [activeId, setActiveId] = useState<string>(ids[0] || '');
    const visibleIdsRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (typeof window === 'undefined' || ids.length === 0) return;

        // Calculate header height in pixels from CSS custom property or fallback to 64
        const style = getComputedStyle(document.documentElement);
        const rawHeight = style.getPropertyValue('--header-height').trim();
        const rootFontSize = parseFloat(style.fontSize) || 16;
        let headerPx = 64;

        if (rawHeight.endsWith('rem')) {
            headerPx = parseFloat(rawHeight) * rootFontSize;
        } else if (rawHeight.endsWith('px')) {
            headerPx = parseFloat(rawHeight);
        }

        if (isNaN(headerPx) || headerPx <= 0) {
            headerPx = 64;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const id = entry.target.id;
                    if (entry.isIntersecting) {
                        visibleIdsRef.current.add(id);
                    } else {
                        visibleIdsRef.current.delete(id);
                    }
                });

                // Pick the first intersecting id according to document order in SECTION_IDS
                const firstVisible = ids.find((id) => visibleIdsRef.current.has(id));
                if (firstVisible) {
                    setActiveId(firstVisible);
                } else {
                    const scrollY = window.scrollY || window.pageYOffset || 0;
                    const isAtBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 50;

                    if (scrollY < 100) {
                        setActiveId(ids[0]);
                    } else if (isAtBottom) {
                        setActiveId(ids[ids.length - 1]);
                    }
                }
            },
            {
                rootMargin: `-${headerPx}px 0px -55% 0px`,
                threshold: [0.01, 0.1, 0.5],
            },
        );

        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) {
                observer.observe(el);
            }
        });

        const visibleIds = visibleIdsRef.current;

        return () => {
            observer.disconnect();
            visibleIds.clear();
        };
    }, [ids]);

    return activeId;
}
