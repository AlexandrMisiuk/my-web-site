import type { ImgHTMLAttributes } from 'react';
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

const TECH_ICON_ASSETS: Record<string, string> = {
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

export interface TechIconProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    name: string;
    size?: number | string;
}

export function FallbackTechIcon({
    size = 24,
    className = '',
    'aria-hidden': ariaHidden = true,
    ...props
}: Omit<TechIconProps, 'name'>) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden={ariaHidden}
            className={className}
            {...(props as React.SVGProps<SVGSVGElement>)}
        >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
        </svg>
    );
}

export function TechIcon({
    name,
    size = 24,
    className = '',
    alt = '',
    'aria-hidden': ariaHidden = true,
    ...props
}: TechIconProps) {
    if (name === 'ios') {
        return (
            <span
                className={`inline-flex items-center justify-center ${className}`.trim()}
                style={{ width: size, height: size }}
            >
                <img
                    src={appleLightSvg}
                    alt={alt}
                    aria-hidden={ariaHidden}
                    width={size}
                    height={size}
                    className="h-full w-full object-contain dark:hidden"
                    {...props}
                />
                <img
                    src={appleDarkSvg}
                    alt={alt}
                    aria-hidden={ariaHidden}
                    width={size}
                    height={size}
                    className="hidden h-full w-full object-contain dark:block"
                    {...props}
                />
            </span>
        );
    }

    const src = TECH_ICON_ASSETS[name];
    if (!src) {
        return <FallbackTechIcon size={size} className={className} aria-hidden={ariaHidden} {...props} />;
    }

    const isExpo = name === 'expo';
    const expoClass = isExpo ? 'dark:invert' : '';

    return (
        <img
            src={src}
            alt={alt}
            aria-hidden={ariaHidden}
            width={size}
            height={size}
            className={`h-full w-full object-contain ${expoClass} ${className}`.trim()}
            {...props}
        />
    );
}
