export type ProjectStatus = 'building' | 'shipped' | 'placeholder';

export interface ProjectMedia {
    kind: 'image' | 'video';
    src: string;
    alt: string;
    poster?: string;
    width: number;
    height: number;
}

export interface Project {
    id: string;
    title: string;
    status: ProjectStatus;
    summary: string;
    technologies: readonly string[];
    media?: ProjectMedia;
    caseStudyUrl?: string;
    externalUrl?: string;
    repoUrl?: string;
}

export interface Principle {
    id: string;
    title: string;
    body: string;
}

export interface NavItem {
    id: string;
    label: string;
    index: string;
}

export interface SiteProfile {
    name: string;
    role: string;
    statement: string;
    status: string;
    links: {
        linkedin: string;
        github: string;
        email: string;
        cv: string;
    };
}

export interface AboutContent {
    paragraphs: readonly string[];
}
