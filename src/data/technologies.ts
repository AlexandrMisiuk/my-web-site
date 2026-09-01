import type { TechnologyCategoryOption, TechnologyItem } from './types';

export const TECHNOLOGY_CATEGORIES: readonly TechnologyCategoryOption[] = [
    { id: 'all', label: 'All' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'backend', label: 'Backend' },
    { id: 'realtime-apis', label: 'Real-Time & APIs' },
] as const;

export const technologies: readonly TechnologyItem[] = [
    // Frontend
    { id: 'typescript', name: 'TypeScript', category: 'frontend', icon: 'typescript' },
    { id: 'angular', name: 'Angular', category: 'frontend', icon: 'angular' },
    { id: 'rxjs', name: 'RxJS', category: 'frontend', icon: 'rxjs' },
    { id: 'ngrx', name: 'NgRx', category: 'frontend', icon: 'ngrx' },
    { id: 'angular-material', name: 'Angular Material', category: 'frontend', icon: 'angular-material' },

    // Mobile
    { id: 'flutter', name: 'Flutter', category: 'mobile', icon: 'flutter' },
    { id: 'dart', name: 'Dart', category: 'mobile', icon: 'dart' },
    { id: 'react-native', name: 'React Native', category: 'mobile', icon: 'react-native' },
    { id: 'expo', name: 'Expo', category: 'mobile', icon: 'expo' },
    { id: 'android', name: 'Android', category: 'mobile', icon: 'android' },
    { id: 'ios', name: 'iOS', category: 'mobile', icon: 'ios' },

    // Backend
    { id: 'dotnet', name: '.NET', category: 'backend', icon: 'dotnet' },
    { id: 'csharp', name: 'C#', category: 'backend', icon: 'csharp' },
    { id: 'nodejs', name: 'Node.js', category: 'backend', icon: 'nodejs' },
    { id: 'sqlite', name: 'SQLite', category: 'backend', icon: 'sqlite' },
    { id: 'firebase', name: 'Firebase', category: 'backend', icon: 'firebase' },

    // Real-Time & APIs
    { id: 'webrtc', name: 'WebRTC', category: 'realtime-apis', icon: 'webrtc' },
    { id: 'signalr', name: 'SignalR', category: 'realtime-apis', icon: 'signalr' },
] as const;
