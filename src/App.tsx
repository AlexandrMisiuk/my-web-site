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

export default function App() {
    return (
        <div className="bg-canvas text-ink flex min-h-screen flex-col">
            {/* Header with Theme Toggle */}
            <header className="border-hairline bg-canvas/80 sticky top-0 z-40 border-b backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
                    <div className="flex items-center gap-3">
                        <span className="text-mono-xs text-accent font-mono font-semibold tracking-wider uppercase">
                            OM / 2026
                        </span>
                        <span className="text-ink-muted">·</span>
                        <span className="text-body text-ink font-medium">Design Tokens & Primitives</span>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            {/* Main Content / Showcase */}
            <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-6 py-12">
                {/* Hero / Typography Scale Section */}
                <section aria-labelledby="typography-heading" className="flex flex-col gap-6">
                    <Eyebrow>01 / Typography & Fluid Type Scale</Eyebrow>
                    <h1 id="typography-heading" className="text-display text-ink font-bold tracking-tight">
                        Oleksandr Misiuk
                    </h1>
                    <h2 className="text-h2 text-ink font-semibold">Lead Software Engineer & Architect</h2>
                    <h3 className="text-h3 text-ink-muted font-medium">
                        Building thoughtful web applications with speed and precision
                    </h3>
                    <p className="text-lead text-ink-muted">
                        Fluid typography adapts continuously across mobile (360px) to wide desktop screens (1440px)
                        using CSS clamp calculations without abrupt breakpoint jumps.
                    </p>
                    <p className="text-body text-ink">
                        Body copy set in Instrument Sans Variable provides crisp legibility at 15–17px, with balanced
                        line heights and WCAG AA contrast compliance in both light and dark modes.
                    </p>
                </section>

                {/* Color Tokens Section */}
                <section aria-labelledby="colors-heading" className="flex flex-col gap-6">
                    <Eyebrow>02 / Color Tokens</Eyebrow>
                    <h2 id="colors-heading" className="text-h2 text-ink font-semibold">
                        Cool Ink & Cobalt Palette
                    </h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                        <div className="border-hairline bg-canvas flex flex-col gap-2 rounded-[var(--radius-sm)] border p-4">
                            <span className="text-mono-xs text-ink-muted font-mono uppercase">Canvas</span>
                            <span className="text-body text-ink font-semibold">bg-canvas</span>
                        </div>
                        <div className="border-hairline bg-surface flex flex-col gap-2 rounded-[var(--radius-sm)] border p-4">
                            <span className="text-mono-xs text-ink-muted font-mono uppercase">Surface</span>
                            <span className="text-body text-ink font-semibold">bg-surface</span>
                        </div>
                        <div className="border-hairline bg-ink text-canvas flex flex-col gap-2 rounded-[var(--radius-sm)] border p-4">
                            <span className="text-mono-xs font-mono uppercase opacity-70">Ink</span>
                            <span className="text-body font-semibold">text-ink</span>
                        </div>
                        <div className="border-hairline bg-surface flex flex-col gap-2 rounded-[var(--radius-sm)] border p-4">
                            <span className="text-mono-xs text-ink-muted font-mono uppercase">Muted</span>
                            <span className="text-body text-ink-muted font-semibold">text-ink-muted</span>
                        </div>
                        <div className="border-hairline bg-surface flex flex-col gap-2 rounded-[var(--radius-sm)] border p-4">
                            <span className="text-mono-xs text-ink-muted font-mono uppercase">Hairline</span>
                            <span className="text-body text-ink font-semibold">border-hairline</span>
                        </div>
                        <div className="border-hairline bg-accent dark:text-canvas flex flex-col gap-2 rounded-[var(--radius-sm)] border p-4 text-white">
                            <span className="text-mono-xs font-mono uppercase opacity-80">Accent</span>
                            <span className="text-body font-semibold">bg-accent</span>
                        </div>
                    </div>
                </section>

                {/* UI Primitives Section */}
                <section aria-labelledby="primitives-heading" className="flex flex-col gap-6">
                    <Eyebrow>03 / Foundational UI Primitives</Eyebrow>
                    <h2 id="primitives-heading" className="text-h2 text-ink font-semibold">
                        Interactive Controls & Tags
                    </h2>

                    {/* ActionLinks */}
                    <div className="flex flex-wrap items-center gap-4">
                        <ActionLink href="#contact" variant="primary">
                            Get in Touch
                        </ActionLink>
                        <ActionLink href="https://github.com" variant="ghost" isExternal>
                            GitHub Profile
                        </ActionLink>
                        <ActionLink variant="ghost" onClick={() => alert('Button clicked!')}>
                            Interactive Button
                        </ActionLink>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                        <Tag>React 19</Tag>
                        <Tag>TypeScript</Tag>
                        <Tag>Tailwind CSS v4</Tag>
                        <Tag>Vite 8</Tag>
                        <Tag>Web Performance</Tag>
                        <Tag>WCAG AA</Tag>
                    </div>
                </section>

                {/* SVG Icons Section */}
                <section aria-labelledby="icons-heading" className="flex flex-col gap-6">
                    <Eyebrow>04 / SVG Icon Primitives</Eyebrow>
                    <h2 id="icons-heading" className="text-h2 text-ink font-semibold">
                        Self-Contained Vector Icons
                    </h2>
                    <div className="border-hairline bg-surface flex flex-wrap items-center gap-6 rounded-[var(--radius-sm)] border p-6">
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

                {/* Motion Layer Preview Section */}
                <section
                    aria-labelledby="motion-heading"
                    className="reveal border-hairline bg-surface flex flex-col gap-4 rounded-[var(--radius-sm)] border p-6"
                >
                    <Eyebrow>05 / CSS Motion Layer</Eyebrow>
                    <h2 id="motion-heading" className="text-h3 text-ink font-semibold">
                        Scroll Timeline & Reveal Keyframes
                    </h2>
                    <p className="text-body text-ink-muted">
                        Animations operate off the main thread with CSS `animation-timeline: view()` and gracefully
                        disable when `prefers-reduced-motion` is active.
                    </p>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-hairline bg-canvas text-mono-xs text-ink-muted border-t px-6 py-6 text-center font-mono">
                © {new Date().getFullYear()} Oleksandr Misiuk · Design System Primitives
            </footer>
        </div>
    );
}
