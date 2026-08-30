import { describe, expect, it } from 'vitest';
import { render } from '@/test/render';
import { SectionBackground } from './SectionBackground';

describe('SectionBackground', () => {
    it('renders a single decorative light image with default lazy loading when dark is omitted', () => {
        render(<SectionBackground light="/assets/light.jpg" />);

        const images = document.querySelectorAll('img');
        expect(images).toHaveLength(1);

        const lightImg = images[0];
        expect(lightImg).toHaveAttribute('src', '/assets/light.jpg');
        expect(lightImg).toHaveAttribute('alt', '');
        expect(lightImg).toHaveAttribute('loading', 'lazy');
        expect(lightImg).toHaveAttribute('fetchpriority', 'auto');
        expect(lightImg).toHaveAttribute('decoding', 'async');
    });

    it('renders a single decorative light image with lazy loading when priority is explicitly false', () => {
        render(<SectionBackground light="/assets/light.jpg" priority={false} />);

        const images = document.querySelectorAll('img');
        expect(images).toHaveLength(1);

        const lightImg = images[0];
        expect(lightImg).toHaveAttribute('src', '/assets/light.jpg');
        expect(lightImg).toHaveAttribute('alt', '');
        expect(lightImg).toHaveAttribute('loading', 'lazy');
        expect(lightImg).toHaveAttribute('fetchpriority', 'auto');
        expect(lightImg).toHaveAttribute('decoding', 'async');
    });

    it('renders dual theme images with default lazy loading when dark is provided without priority', () => {
        render(<SectionBackground light="/assets/light.jpg" dark="/assets/dark.jpg" />);

        const images = document.querySelectorAll('img');
        expect(images).toHaveLength(2);

        const [lightImg, darkImg] = images;

        expect(lightImg).toHaveAttribute('src', '/assets/light.jpg');
        expect(lightImg).toHaveAttribute('alt', '');
        expect(lightImg).toHaveAttribute('loading', 'lazy');
        expect(lightImg).toHaveAttribute('fetchpriority', 'auto');
        expect(lightImg).toHaveAttribute('decoding', 'async');

        expect(darkImg).toHaveAttribute('src', '/assets/dark.jpg');
        expect(darkImg).toHaveAttribute('alt', '');
        expect(darkImg).toHaveAttribute('loading', 'lazy');
        expect(darkImg).toHaveAttribute('fetchpriority', 'auto');
        expect(darkImg).toHaveAttribute('decoding', 'async');
    });

    it('renders dual theme images with eager priority when priority is true', () => {
        render(<SectionBackground light="/assets/light.jpg" dark="/assets/dark.jpg" priority />);

        const images = document.querySelectorAll('img');
        expect(images).toHaveLength(2);

        const [lightImg, darkImg] = images;

        expect(lightImg).toHaveAttribute('src', '/assets/light.jpg');
        expect(lightImg).toHaveAttribute('alt', '');
        expect(lightImg).toHaveAttribute('loading', 'eager');
        expect(lightImg).toHaveAttribute('fetchpriority', 'high');
        expect(lightImg).toHaveAttribute('decoding', 'async');

        expect(darkImg).toHaveAttribute('src', '/assets/dark.jpg');
        expect(darkImg).toHaveAttribute('alt', '');
        expect(darkImg).toHaveAttribute('loading', 'eager');
        expect(darkImg).toHaveAttribute('fetchpriority', 'high');
        expect(darkImg).toHaveAttribute('decoding', 'async');
    });

    it('renders the gradient scrim overlay', () => {
        render(<SectionBackground light="/assets/light.jpg" />);

        const scrim = document.querySelector('div');
        expect(scrim).not.toBeNull();
    });
});
