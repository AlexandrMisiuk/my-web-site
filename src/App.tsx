import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { ActionLink } from '@/components/ui/ActionLink';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Tag } from '@/components/ui/Tag';
import {
    ArrowRightIcon,
    ArrowUpRightIcon,
    DocumentIcon,
    GitHubIcon,
    LinkedInIcon,
    MailIcon,
    MoonIcon,
    SunIcon,
} from '@/components/ui/icons';
import { aboutContent, navItems, principles, projects, siteProfile, technologies } from '@/data';

export default function App() {
    return (
        <div className="bg-canvas text-ink flex min-h-screen flex-col">
            {/* Header with Dynamic Profile Identity & Theme Toggle */}
            <header className="border-hairline bg-canvas/80 sticky top-0 z-40 border-b backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
                    <div className="flex items-center gap-3">
                        <span className="text-mono-xs text-accent font-mono font-semibold tracking-wider uppercase">
                            OM / 2026
                        </span>
                        <span className="text-ink-muted">·</span>
                        <span className="text-body text-ink font-medium">Typed Content Data Layer</span>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            {/* Main Content / Data Layer Showcase */}
            <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-6 py-12">
                {/* 01: Profile Identity (site.ts) */}
                <section aria-labelledby="profile-heading" className="flex flex-col gap-6">
                    <Eyebrow>01 / Site Profile (src/data/site.ts)</Eyebrow>
                    <h1 id="profile-heading" className="text-display text-ink font-bold tracking-tight">
                        {siteProfile.name}
                    </h1>
                    <h2 className="text-h2 text-ink font-semibold">{siteProfile.role}</h2>
                    <p className="text-lead text-ink-muted">{siteProfile.statement}</p>
                    <div className="flex flex-wrap items-center gap-2">
                        <Tag className="border-accent/40 text-accent">{siteProfile.status}</Tag>
                    </div>

                    {/* Dynamic Action Links with Empty String Omission Guards */}
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                        {Boolean(siteProfile.links.linkedin) && (
                            <ActionLink href={siteProfile.links.linkedin} variant="primary" isExternal>
                                <span className="flex items-center gap-2">
                                    <LinkedInIcon size={16} />
                                    <span>LinkedIn</span>
                                </span>
                            </ActionLink>
                        )}
                        {Boolean(siteProfile.links.github) && (
                            <ActionLink href={siteProfile.links.github} variant="ghost" isExternal>
                                <span className="flex items-center gap-2">
                                    <GitHubIcon size={16} />
                                    <span>GitHub</span>
                                </span>
                            </ActionLink>
                        )}
                        {Boolean(siteProfile.links.email) && (
                            <ActionLink href={`mailto:${siteProfile.links.email}`} variant="ghost">
                                <span className="flex items-center gap-2">
                                    <MailIcon size={16} />
                                    <span>Contact</span>
                                </span>
                            </ActionLink>
                        )}
                        {Boolean(siteProfile.links.cv) && (
                            <ActionLink href={siteProfile.links.cv} variant="ghost" download>
                                <span className="flex items-center gap-2">
                                    <DocumentIcon size={16} />
                                    <span>Resume / CV</span>
                                </span>
                            </ActionLink>
                        )}
                    </div>
                </section>

                {/* 02: Navigation Map (navigation.ts) */}
                <section aria-labelledby="nav-heading" className="flex flex-col gap-6">
                    <Eyebrow>02 / Navigation Anchors (src/data/navigation.ts)</Eyebrow>
                    <h2 id="nav-heading" className="text-h2 text-ink font-semibold">
                        Indexed Sections ({navItems.length})
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {navItems.map((item) => (
                            <div
                                key={item.id}
                                className="border-hairline bg-surface flex items-center justify-between rounded-sm border p-4"
                            >
                                <span className="text-body text-ink font-medium">{item.label}</span>
                                <span className="text-mono-xs text-accent font-mono font-semibold">{item.index}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 03: Projects Showcase (projects.ts) */}
                <section aria-labelledby="projects-heading" className="flex flex-col gap-6">
                    <Eyebrow>03 / Projects Model (src/data/projects.ts)</Eyebrow>
                    <h2 id="projects-heading" className="text-h2 text-ink font-semibold">
                        Selected Work & Case Studies ({projects.length})
                    </h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {projects.map((proj) => (
                            <div
                                key={proj.id}
                                className="border-hairline bg-surface flex flex-col justify-between gap-4 rounded-sm border p-6"
                            >
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-h3 text-ink font-semibold">{proj.title}</h3>
                                        <Tag
                                            className={
                                                proj.status === 'building'
                                                    ? 'border-accent/40 text-accent'
                                                    : 'text-ink-muted'
                                            }
                                        >
                                            {proj.status}
                                        </Tag>
                                    </div>
                                    <p className="text-body text-ink-muted">{proj.summary}</p>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {proj.technologies.map((tech) => (
                                        <Tag key={tech}>{tech}</Tag>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 04: Engineering Principles (principles.ts) */}
                <section aria-labelledby="principles-heading" className="flex flex-col gap-6">
                    <Eyebrow>04 / Engineering Principles (src/data/principles.ts)</Eyebrow>
                    <h2 id="principles-heading" className="text-h2 text-ink font-semibold">
                        How I Work ({principles.length} Tenets)
                    </h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {principles.map((principle, idx) => (
                            <div
                                key={principle.id}
                                className="border-hairline bg-surface flex flex-col gap-3 rounded-sm border p-6"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-h3 text-ink font-semibold">{principle.title}</h3>
                                    <span className="text-mono-xs text-ink-muted font-mono">0{idx + 1}</span>
                                </div>
                                <p className="text-body text-ink-muted">{principle.body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 05: Core Technologies (technologies.ts) */}
                <section aria-labelledby="technologies-heading" className="flex flex-col gap-6">
                    <Eyebrow>05 / Core Technologies (src/data/technologies.ts)</Eyebrow>
                    <h2 id="technologies-heading" className="text-h2 text-ink font-semibold">
                        Technical Stack ({technologies.length} Technologies)
                    </h2>
                    <div className="flex flex-wrap gap-2.5">
                        {technologies.map((tech) => (
                            <Tag key={tech} className="text-body px-3.5 py-1.5 font-sans normal-case">
                                {tech}
                            </Tag>
                        ))}
                    </div>
                </section>

                {/* 06: About Copy (about.ts) */}
                <section aria-labelledby="about-heading" className="flex flex-col gap-6">
                    <Eyebrow>06 / About Copy (src/data/about.ts)</Eyebrow>
                    <h2 id="about-heading" className="text-h2 text-ink font-semibold">
                        Biographical Prose ({aboutContent.paragraphs.length} Paragraphs)
                    </h2>
                    <div className="border-hairline bg-surface flex flex-col gap-4 rounded-sm border p-6">
                        {aboutContent.paragraphs.map((p, i) => (
                            <p key={i} className="text-body text-ink leading-relaxed">
                                {p}
                            </p>
                        ))}
                    </div>
                </section>

                {/* 07: Vector Icons & Motion Preview */}
                <section aria-labelledby="icons-heading" className="flex flex-col gap-6">
                    <Eyebrow>07 / UI Primitives & SVG Icons</Eyebrow>
                    <h2 id="icons-heading" className="text-h2 text-ink font-semibold">
                        Vector Icons & CSS Motion Layer
                    </h2>
                    <div className="border-hairline bg-surface flex flex-wrap items-center gap-6 rounded-sm border p-6">
                        <div className="flex items-center gap-2">
                            <SunIcon size={24} className="text-accent" />
                            <span className="text-mono-xs text-ink-muted font-mono">SunIcon</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MoonIcon size={24} className="text-accent" />
                            <span className="text-mono-xs text-ink-muted font-mono">MoonIcon</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ArrowUpRightIcon size={24} className="text-accent" />
                            <span className="text-mono-xs text-ink-muted font-mono">ArrowUpRight</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ArrowRightIcon size={24} className="text-accent" />
                            <span className="text-mono-xs text-ink-muted font-mono">ArrowRight</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <GitHubIcon size={24} className="text-accent" />
                            <span className="text-mono-xs text-ink-muted font-mono">GitHub</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <LinkedInIcon size={24} className="text-accent" />
                            <span className="text-mono-xs text-ink-muted font-mono">LinkedIn</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MailIcon size={24} className="text-accent" />
                            <span className="text-mono-xs text-ink-muted font-mono">Mail</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DocumentIcon size={24} className="text-accent" />
                            <span className="text-mono-xs text-ink-muted font-mono">Document</span>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-hairline bg-canvas text-mono-xs text-ink-muted border-t px-6 py-6 text-center font-mono">
                © {new Date().getFullYear()} {siteProfile.name} · Typed Content Data Layer
            </footer>
        </div>
    );
}
