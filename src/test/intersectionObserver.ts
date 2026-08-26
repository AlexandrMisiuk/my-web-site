type ObservedEntry = { id: string; isIntersecting: boolean };

let installed = false;
let originalIntersectionObserver: typeof IntersectionObserver | undefined;
let callback: IntersectionObserverCallback | undefined;
let lastOptions: IntersectionObserverInit | undefined;
let lastObserver: FakeIntersectionObserver | undefined;
const observed = new Map<string, Element>();

class FakeIntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null;
    readonly rootMargin: string;
    readonly thresholds: ReadonlyArray<number>;
    disconnected = false;

    constructor(cb: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        callback = cb;
        lastOptions = options;
        this.root = options?.root ?? null;
        this.rootMargin = options?.rootMargin ?? '0px';
        const threshold = options?.threshold;
        this.thresholds = Array.isArray(threshold) ? threshold : [threshold ?? 0];
    }

    observe(element: Element): void {
        if (element.id) {
            observed.set(element.id, element);
        }
    }

    unobserve(element: Element): void {
        if (element.id) {
            observed.delete(element.id);
        }
    }

    disconnect(): void {
        this.disconnected = true;
        observed.clear();
    }

    takeRecords(): IntersectionObserverEntry[] {
        return [];
    }
}

function createEntry(target: Element, isIntersecting: boolean): IntersectionObserverEntry {
    const bounds = target.getBoundingClientRect();
    return {
        target,
        isIntersecting,
        intersectionRatio: isIntersecting ? 1 : 0,
        boundingClientRect: bounds,
        intersectionRect: bounds,
        rootBounds: null,
        time: 0,
    };
}

export function mockIntersectionObserver(): void {
    if (typeof window === 'undefined' || installed) return;
    originalIntersectionObserver = window.IntersectionObserver;
    const Observer = function (cb: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        const instance = new FakeIntersectionObserver(cb, options);
        lastObserver = instance;
        return instance;
    } as unknown as typeof IntersectionObserver;
    Observer.prototype = FakeIntersectionObserver.prototype;
    window.IntersectionObserver = Observer;
    installed = true;
}

export function emitIntersections(entries: ReadonlyArray<ObservedEntry>): void {
    if (!callback || !lastObserver) return;

    const mapped = entries.flatMap(({ id, isIntersecting }) => {
        const target = observed.get(id) ?? document.getElementById(id);
        return target ? [createEntry(target, isIntersecting)] : [];
    });

    callback(mapped, lastObserver);
}

export function getObserverOptions(): IntersectionObserverInit | undefined {
    return lastOptions;
}

export function getObservedIds(): string[] {
    return [...observed.keys()];
}

export function wasObserverDisconnected(): boolean {
    return lastObserver?.disconnected ?? false;
}

export function resetIntersectionObserver(): void {
    observed.clear();
    callback = undefined;
    lastOptions = undefined;
    lastObserver = undefined;
    mockIntersectionObserver();
}

export function restoreIntersectionObserver(): void {
    resetIntersectionObserver();
    if (installed && typeof window !== 'undefined' && originalIntersectionObserver) {
        window.IntersectionObserver = originalIntersectionObserver;
    }
    installed = false;
    originalIntersectionObserver = undefined;
}
