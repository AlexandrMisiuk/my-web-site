import { ActionLink } from '@/components/ui/ActionLink';
import { DocumentIcon, GitHubIcon, LinkedInIcon, MailIcon } from '@/components/ui/icons';
import { contactContent as defaultContactContent } from '@/data/contact';
import { siteProfile as defaultSiteProfile } from '@/data/site';
import type { ContactContent, SiteProfile } from '@/data/types';

export interface ContactProps {
    profile?: SiteProfile;
    content?: ContactContent;
    className?: string;
}

export function Contact({
    profile = defaultSiteProfile,
    content = defaultContactContent,
    className = '',
}: ContactProps) {
    const hasEmail = Boolean(profile.links?.email);
    const hasLinkedIn = Boolean(profile.links?.linkedin);
    const hasGitHub = Boolean(profile.links?.github);
    const hasCv = Boolean(profile.links?.cv);
    const hasAnyLink = hasEmail || hasLinkedIn || hasGitHub || hasCv;
    const hasParagraphs = Boolean(content.paragraphs && content.paragraphs.length > 0);

    return (
        <div
            className={`border-hairline bg-surface flex flex-col gap-6 rounded-sm border p-6 transition-colors sm:gap-8 sm:p-8 ${className}`.trim()}
        >
            <div className="flex flex-col gap-4 sm:gap-6">
                <p className="text-h3 text-ink font-semibold tracking-tight">Let's build something great.</p>

                {hasParagraphs ? (
                    <div className="text-body text-ink-muted flex max-w-[62ch] flex-col gap-4 leading-relaxed sm:gap-6">
                        {content.paragraphs.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                ) : null}
            </div>

            {hasAnyLink ? (
                <>
                    <div className="border-hairline border-t" />

                    <div className="flex flex-wrap items-center gap-4">
                        {hasEmail ? (
                            <ActionLink href={`mailto:${profile.links.email}`} variant="primary">
                                <MailIcon size={18} className="shrink-0 font-mono" />
                                <span>Email</span>
                            </ActionLink>
                        ) : null}
                        {hasLinkedIn ? (
                            <ActionLink href={profile.links.linkedin} variant="ghost" isExternal>
                                <LinkedInIcon size={18} className="shrink-0 font-mono" />
                                <span>LinkedIn</span>
                            </ActionLink>
                        ) : null}
                        {hasGitHub ? (
                            <ActionLink href={profile.links.github} variant="ghost" isExternal>
                                <GitHubIcon size={18} className="shrink-0 font-mono" />
                                <span>GitHub</span>
                            </ActionLink>
                        ) : null}
                        {hasCv ? (
                            <ActionLink href={profile.links.cv} variant="ghost" download>
                                <DocumentIcon size={18} className="shrink-0 font-mono" />
                                <span>Download CV</span>
                            </ActionLink>
                        ) : null}
                    </div>
                </>
            ) : null}
        </div>
    );
}
