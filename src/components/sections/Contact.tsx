import { ActionLink } from '@/components/ui/ActionLink';
import { DocumentIcon, GitHubIcon, LinkedInIcon, MailIcon } from '@/components/ui/icons';
import { siteProfile as defaultSiteProfile } from '@/data/site';
import type { SiteProfile } from '@/data/types';

export interface ContactProps {
    profile?: SiteProfile;
    className?: string;
}

export function Contact({ profile = defaultSiteProfile, className = '' }: ContactProps) {
    const hasEmail = Boolean(profile.links?.email);
    const hasLinkedIn = Boolean(profile.links?.linkedin);
    const hasGitHub = Boolean(profile.links?.github);
    const hasCv = Boolean(profile.links?.cv);
    const hasAnyLink = hasEmail || hasLinkedIn || hasGitHub || hasCv;

    return (
        <div className={`space-y-8 ${className}`.trim()}>
            <div className="space-y-3">
                <p className="text-lead text-ink sm:text-h3 font-medium">Let's build something great.</p>
                {profile.status ? <p className="text-body text-ink-muted">{profile.status}</p> : null}
            </div>

            {hasAnyLink ? (
                <div className="flex flex-wrap items-center gap-4">
                    {hasEmail ? (
                        <ActionLink href={`mailto:${profile.links.email}`} variant="primary">
                            <MailIcon size={18} className="shrink-0" />
                            <span>Email</span>
                        </ActionLink>
                    ) : null}
                    {hasLinkedIn ? (
                        <ActionLink href={profile.links.linkedin} variant="ghost" isExternal>
                            <LinkedInIcon size={18} className="shrink-0" />
                            <span>LinkedIn</span>
                        </ActionLink>
                    ) : null}
                    {hasGitHub ? (
                        <ActionLink href={profile.links.github} variant="ghost" isExternal>
                            <GitHubIcon size={18} className="shrink-0" />
                            <span>GitHub</span>
                        </ActionLink>
                    ) : null}
                    {hasCv ? (
                        <ActionLink href={profile.links.cv} variant="ghost" download>
                            <DocumentIcon size={18} className="shrink-0" />
                            <span>Download CV</span>
                        </ActionLink>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}
