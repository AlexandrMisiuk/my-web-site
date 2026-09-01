import { describe, expect, it } from 'vitest';
import { render, screen } from '@/test/render';
import { TechIcon } from './TechIcon';
import {
    AndroidIcon,
    AngularIcon,
    AngularMaterialIcon,
    CSharpIcon,
    DartIcon,
    DotNetIcon,
    ExpoIcon,
    FallbackTechIcon,
    FirebaseIcon,
    FlutterIcon,
    IosIcon,
    NgrxIcon,
    NodeJsIcon,
    ReactNativeIcon,
    RxjsIcon,
    SignalRIcon,
    SqliteIcon,
    TypeScriptIcon,
    WebRtcIcon,
} from './tech';

const allTechIconKeys = [
    'typescript',
    'angular',
    'rxjs',
    'ngrx',
    'angular-material',
    'flutter',
    'dart',
    'react-native',
    'expo',
    'android',
    'ios',
    'dotnet',
    'csharp',
    'nodejs',
    'sqlite',
    'firebase',
    'webrtc',
    'signalr',
] as const;

describe('TechIcon Dispatcher', () => {
    it.each(allTechIconKeys)('renders the %s icon correctly via dispatcher', (iconKey) => {
        render(<TechIcon name={iconKey} className="test-icon-class" />);
        const svg = document.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('aria-hidden', 'true');
        expect(svg).toHaveClass('test-icon-class');
        expect(svg).toHaveAttribute('width', '24');
        expect(svg).toHaveAttribute('height', '24');
    });

    it('renders fallback icon when an unknown icon name is supplied', () => {
        render(<TechIcon name="non-existent-tool" data-testid="fallback-svg" />);
        const svg = document.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('data-testid', 'fallback-svg');
    });

    it('applies custom dimensions and accessible labels when provided', () => {
        render(<TechIcon name="typescript" size={40} role="img" aria-label="TypeScript Logo" aria-hidden={false} />);
        const svg = screen.getByRole('img', { name: 'TypeScript Logo' });
        expect(svg).toHaveAttribute('width', '40');
        expect(svg).toHaveAttribute('height', '40');
        expect(svg).not.toHaveAttribute('aria-hidden', 'true');
    });
});

describe('Individual Tech Icon Primitives', () => {
    const primitives = [
        ['TypeScriptIcon', TypeScriptIcon],
        ['AngularIcon', AngularIcon],
        ['RxjsIcon', RxjsIcon],
        ['NgrxIcon', NgrxIcon],
        ['AngularMaterialIcon', AngularMaterialIcon],
        ['FlutterIcon', FlutterIcon],
        ['DartIcon', DartIcon],
        ['ReactNativeIcon', ReactNativeIcon],
        ['ExpoIcon', ExpoIcon],
        ['AndroidIcon', AndroidIcon],
        ['IosIcon', IosIcon],
        ['DotNetIcon', DotNetIcon],
        ['CSharpIcon', CSharpIcon],
        ['NodeJsIcon', NodeJsIcon],
        ['SqliteIcon', SqliteIcon],
        ['FirebaseIcon', FirebaseIcon],
        ['WebRtcIcon', WebRtcIcon],
        ['SignalRIcon', SignalRIcon],
        ['FallbackTechIcon', FallbackTechIcon],
    ] as const;

    it.each(primitives)('renders %s with default size and decorative aria-hidden', (_name, IconComponent) => {
        const { rerender } = render(<IconComponent className="primitive-icon" />);
        const svg = document.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('aria-hidden', 'true');
        expect(svg).toHaveClass('primitive-icon');
        expect(svg).toHaveAttribute('width', '24');
        expect(svg).toHaveAttribute('height', '24');

        rerender(<IconComponent size={32} role="img" aria-label={`${_name} icon`} aria-hidden={false} />);
        const icon = screen.getByRole('img', { name: `${_name} icon` });
        expect(icon).toHaveAttribute('width', '32');
        expect(icon).toHaveAttribute('height', '32');
    });
});
