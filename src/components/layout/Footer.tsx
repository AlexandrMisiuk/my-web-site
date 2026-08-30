import { Container } from '@/components/layout/Container';
import { ActionLink } from '@/components/ui/ActionLink';
import { DocumentIcon, GitHubIcon, LinkedInIcon, MailIcon } from '@/components/ui/icons';
import { siteProfile as defaultProfile } from '@/data/site';
import type { SiteProfile } from '@/data/types';

export interface FooterProps {
    className?: string;
    profile?: SiteProfile;
}

export function Footer({ className = '', profile = defaultProfile }: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`border-hairline bg-canvas border-t py-12 ${className}`.trim()}>
            <Container as="div" className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1">
                    <p className="text-mono-xs text-ink font-mono font-semibold tracking-wider uppercase">
                        {profile.name}
                    </p>
                    <p className="text-mono-xs text-ink-muted font-mono">© {currentYear} · All rights reserved</p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    {profile.links.email ? (
                        <ActionLink
                            href={`mailto:${profile.links.email}`}
                            variant="ghost"
                            className="min-h-9 px-3 py-1.5 font-mono text-xs"
                            aria-label="Send email"
                        >
                            <MailIcon size={18} />
                            <span>Email</span>
                        </ActionLink>
                    ) : null}

                    {profile.links.linkedin ? (
                        <ActionLink
                            href={profile.links.linkedin}
                            variant="ghost"
                            className="min-h-9 px-3 py-1.5 font-mono text-xs"
                            aria-label="LinkedIn profile"
                        >
                            <LinkedInIcon size={18} />
                            <span>LinkedIn</span>
                        </ActionLink>
                    ) : null}

                    {profile.links.github ? (
                        <ActionLink
                            href={profile.links.github}
                            variant="ghost"
                            className="min-h-9 px-3 py-1.5 font-mono text-xs"
                            aria-label="GitHub profile"
                        >
                            <GitHubIcon size={18} />
                            <span>GitHub</span>
                        </ActionLink>
                    ) : null}

                    {profile.links.cv ? (
                        <ActionLink
                            href={profile.links.cv}
                            variant="ghost"
                            download
                            className="min-h-9 px-3 py-1.5 font-mono text-xs"
                            aria-label="Download CV"
                        >
                            <DocumentIcon size={18} />
                            <span>Download CV</span>
                        </ActionLink>
                    ) : null}
                </div>
            </Container>
        </footer>
    );
}
