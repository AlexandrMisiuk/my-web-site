import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { mockIntersectionObserver, resetIntersectionObserver } from './intersectionObserver';
import { mockMatchMedia, resetMatchMedia } from './matchMedia';

mockMatchMedia();
mockIntersectionObserver();

afterEach(() => {
    cleanup();
    resetMatchMedia();
    resetIntersectionObserver();
    sessionStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.body.style.overflow = '';
});
