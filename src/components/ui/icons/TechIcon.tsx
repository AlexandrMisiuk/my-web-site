import type { ComponentType } from 'react';
import type { IconProps } from './index';
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

const TECH_ICON_MAP: Record<string, ComponentType<IconProps>> = {
    typescript: TypeScriptIcon,
    angular: AngularIcon,
    rxjs: RxjsIcon,
    ngrx: NgrxIcon,
    'angular-material': AngularMaterialIcon,
    flutter: FlutterIcon,
    dart: DartIcon,
    'react-native': ReactNativeIcon,
    expo: ExpoIcon,
    android: AndroidIcon,
    ios: IosIcon,
    dotnet: DotNetIcon,
    csharp: CSharpIcon,
    nodejs: NodeJsIcon,
    sqlite: SqliteIcon,
    firebase: FirebaseIcon,
    webrtc: WebRtcIcon,
    signalr: SignalRIcon,
};

export interface TechIconProps extends IconProps {
    name: string;
}

export function TechIcon({ name, ...props }: TechIconProps) {
    const IconComponent = TECH_ICON_MAP[name] ?? FallbackTechIcon;
    return <IconComponent {...props} />;
}
