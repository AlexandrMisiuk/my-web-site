import { describe, expect, it } from 'vitest';
import { render, screen } from '@/test/render';
import { FallbackTechIcon, TechIcon } from './TechIcon';
import androidSvg from '@/assets/tech/android.svg';
import angularSvg from '@/assets/tech/angular.svg';
import angularMaterialSvg from '@/assets/tech/angularmaterial.svg';
import appleDarkSvg from '@/assets/tech/apple-dark.svg';
import appleLightSvg from '@/assets/tech/apple-light.svg';
import signalrSvg from '@/assets/tech/azure-signalr.svg';
import csharpSvg from '@/assets/tech/csharp.svg';
import dartSvg from '@/assets/tech/dart.svg';
import dotnetSvg from '@/assets/tech/dotnet.svg';
import expoSvg from '@/assets/tech/expo.svg';
import firebaseSvg from '@/assets/tech/firebase.svg';
import flutterSvg from '@/assets/tech/flutter.svg';
import ngrxSvg from '@/assets/tech/ngrx.svg';
import nodejsSvg from '@/assets/tech/nodedotjs.svg';
import reactNativeSvg from '@/assets/tech/reactnative.svg';
import rxjsSvg from '@/assets/tech/rxjs.svg';
import sqliteSvg from '@/assets/tech/sqlite.svg';
import typescriptSvg from '@/assets/tech/typescript.svg';
import webrtcSvg from '@/assets/tech/webrtc.svg';

const techIconExpectedSrcMap: Record<string, string> = {
    typescript: typescriptSvg,
    angular: angularSvg,
    rxjs: rxjsSvg,
    ngrx: ngrxSvg,
    'angular-material': angularMaterialSvg,
    flutter: flutterSvg,
    dart: dartSvg,
    'react-native': reactNativeSvg,
    expo: expoSvg,
    android: androidSvg,
    dotnet: dotnetSvg,
    csharp: csharpSvg,
    nodejs: nodejsSvg,
    sqlite: sqliteSvg,
    firebase: firebaseSvg,
    webrtc: webrtcSvg,
    signalr: signalrSvg,
};

const allSingleTechIconKeys = Object.keys(techIconExpectedSrcMap) as (keyof typeof techIconExpectedSrcMap)[];

describe('TechIcon Component', () => {
    it.each(allSingleTechIconKeys)('renders the %s icon directly from SVG asset', (iconKey) => {
        render(<TechIcon name={iconKey} className="test-icon-class" />);
        const img = document.querySelector('img');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', techIconExpectedSrcMap[iconKey]);
        expect(img).toHaveAttribute('aria-hidden', 'true');
        expect(img).toHaveClass('test-icon-class');
        expect(img).toHaveAttribute('width', '24');
        expect(img).toHaveAttribute('height', '24');
    });

    it('renders the ios icon with dual light and dark theme assets', () => {
        render(<TechIcon name="ios" className="test-ios-class" />);
        const images = document.querySelectorAll('img');
        expect(images).toHaveLength(2);

        const [lightImg, darkImg] = images;
        expect(lightImg).toHaveAttribute('src', appleLightSvg);
        expect(lightImg).toHaveClass('dark:hidden');
        expect(darkImg).toHaveAttribute('src', appleDarkSvg);
        expect(darkImg).toHaveClass('dark:block');
    });

    it('applies dark:invert class to expo icon', () => {
        render(<TechIcon name="expo" />);
        const img = document.querySelector('img');
        expect(img).toBeInTheDocument();
        expect(img).toHaveClass('dark:invert');
    });

    it('renders fallback icon when an unknown icon name is supplied', () => {
        render(<TechIcon name="non-existent-tool" data-testid="fallback-svg" />);
        const svg = screen.getByTestId('fallback-svg');
        expect(svg).toBeInTheDocument();
        expect(svg.tagName.toLowerCase()).toBe('svg');
        expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('applies custom dimensions and accessible attributes when provided', () => {
        render(<TechIcon name="typescript" size={40} alt="TypeScript Logo" aria-hidden={false} />);
        const img = screen.getByAltText('TypeScript Logo');
        expect(img).toHaveAttribute('width', '40');
        expect(img).toHaveAttribute('height', '40');
        expect(img).toHaveAttribute('aria-hidden', 'false');
    });

    it('renders FallbackTechIcon directly with default and custom props', () => {
        const { rerender } = render(<FallbackTechIcon className="custom-fallback" />);
        const initialSvg = document.querySelector('svg');
        expect(initialSvg).toBeInTheDocument();
        expect(initialSvg).toHaveClass('custom-fallback');
        expect(initialSvg).toHaveAttribute('width', '24');
        expect(initialSvg).toHaveAttribute('height', '24');
        expect(initialSvg).toHaveAttribute('aria-hidden', 'true');

        rerender(<FallbackTechIcon size={36} aria-hidden={false} role="img" aria-label="Fallback Icon" />);
        const customSvg = screen.getByRole('img', { name: 'Fallback Icon' });
        expect(customSvg).toHaveAttribute('width', '36');
        expect(customSvg).toHaveAttribute('height', '36');
    });
});
