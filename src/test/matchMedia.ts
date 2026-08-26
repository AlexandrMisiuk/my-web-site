type MediaChangeListener = (event: MediaQueryListEvent) => void;

interface MediaQueryState {
    matches: boolean;
    listeners: Set<MediaChangeListener>;
}

const queries = new Map<string, MediaQueryState>();

let installed = false;
let originalMatchMedia: typeof window.matchMedia | undefined;

function getOrCreate(query: string, defaultMatches = false): MediaQueryState {
    let state = queries.get(query);
    if (!state) {
        state = { matches: defaultMatches, listeners: new Set() };
        queries.set(query, state);
    }
    return state;
}

function createChangeEvent(query: string, matches: boolean): MediaQueryListEvent {
    const event = new Event('change') as MediaQueryListEvent;
    Object.defineProperty(event, 'matches', { configurable: true, value: matches });
    Object.defineProperty(event, 'media', { configurable: true, value: query });
    return event;
}

function createMediaQueryList(query: string): MediaQueryList {
    const mql = {
        get matches() {
            return getOrCreate(query).matches;
        },
        get media() {
            return query;
        },
        onchange: null as MediaQueryList['onchange'],
        addEventListener(type: string, listener: EventListenerOrEventListenerObject) {
            if (type === 'change' && typeof listener === 'function') {
                getOrCreate(query).listeners.add(listener as MediaChangeListener);
            }
        },
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject) {
            if (type === 'change' && typeof listener === 'function') {
                getOrCreate(query).listeners.delete(listener as MediaChangeListener);
            }
        },
        addListener(listener: MediaChangeListener) {
            getOrCreate(query).listeners.add(listener);
        },
        removeListener(listener: MediaChangeListener) {
            getOrCreate(query).listeners.delete(listener);
        },
        dispatchEvent(event: Event) {
            if (event.type === 'change') {
                const state = getOrCreate(query);
                state.listeners.forEach((listener) => listener(event as MediaQueryListEvent));
            }
            return true;
        },
    };

    return mql as MediaQueryList;
}

export function mockMatchMedia(initial?: Record<string, boolean>): void {
    if (typeof window === 'undefined') return;

    if (!installed) {
        originalMatchMedia = typeof window.matchMedia === 'function' ? window.matchMedia.bind(window) : undefined;
        window.matchMedia = (query: string) => createMediaQueryList(query);
        installed = true;
    }

    if (!initial) return;

    for (const [query, matches] of Object.entries(initial)) {
        getOrCreate(query).matches = matches;
    }
}

export function setMediaMatches(query: string, matches: boolean): void {
    mockMatchMedia();
    const state = getOrCreate(query);
    state.matches = matches;
    const event = createChangeEvent(query, matches);
    state.listeners.forEach((listener) => listener(event));
}

export function resetMatchMedia(): void {
    queries.clear();
    mockMatchMedia();
}

export function restoreMatchMedia(): void {
    queries.clear();
    if (installed && typeof window !== 'undefined' && originalMatchMedia) {
        window.matchMedia = originalMatchMedia;
    }
    installed = false;
    originalMatchMedia = undefined;
}
