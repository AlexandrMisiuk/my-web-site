import { Container } from '@/components/layout/Container';
import { ActionLink } from '@/components/ui/ActionLink';
import { DocumentIcon, GitHubIcon, LinkedInIcon, MailIcon } from '@/components/ui/icons';
import { siteProfile } from '@/data/site';

export interface FooterProps {
    className?: string;
}

export function Footer({ className = '' }: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`border-hairline bg-canvas border-t py-12 ${className}`.trim()}>
            <Container as="div" className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1">
                    <p className="text-mono-xs text-ink font-mono font-semibold tracking-wider uppercase">
                        {siteProfile.name}
                    </p>
                    <p className="text-mono-xs text-ink-muted font-mono">© {currentYear} · All rights reserved</p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    {siteProfile.links.linkedin ? (
                        <ActionLink
                            href={siteProfile.links.linkedin}
                            variant="ghost"
                            className="min-h-9 px-3 py-1.5 font-mono text-xs"
                            aria-label="LinkedIn profile"
                        >
                            <LinkedInIcon size={16} />
                            <span>LinkedIn</span>
                        </ActionLink>
                    ) : null}

                    {siteProfile.links.github ? (
                        <ActionLink
                            href={siteProfile.links.github}
                            variant="ghost"
                            className="min-h-9 px-3 py-1.5 font-mono text-xs"
                            aria-label="GitHub profile"
                        >
                            <GitHubIcon size={16} />
                            <span>GitHub</span>
                        </ActionLink>
                    ) : null}

                    {siteProfile.links.email ? (
                        <ActionLink
                            href={`mailto:${siteProfile.links.email}`}
                            variant="ghost"
                            className="min-h-9 px-3 py-1.5 font-mono text-xs"
                            aria-label="Send email"
                        >
                            <MailIcon size={16} />
                            <span>Email</span>
                        </ActionLink>
                    ) : null}

                    {siteProfile.links.cv ? (
                        <ActionLink
                            href={siteProfile.links.cv}
                            variant="ghost"
                            download
                            className="min-h-9 px-3 py-1.5 font-mono text-xs"
                            aria-label="Download CV"
                        >
                            <DocumentIcon size={16} />
                            <span>CV</span>
                        </ActionLink>
                    ) : null}
                </div>
            </Container>
        </footer>
    );
}
