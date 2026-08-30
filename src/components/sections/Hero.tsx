import { ActionLink } from '@/components/ui/ActionLink';
import { StatusPill } from '@/components/ui/StatusPill';
import { TerminalWindow } from '@/components/ui/TerminalWindow';
import { siteProfile as defaultSiteProfile } from '@/data/site';
import type { SiteProfile } from '@/data/types';

export interface HeroProps {
    profile?: SiteProfile;
    className?: string;
}

export function Hero({ profile = defaultSiteProfile, className = '' }: HeroProps) {
    const prompt = profile.role ? `alex@${profile.role} ~ %` : 'alex ~ %';

    return (
        <div
            className={`flex animate-[hero-rise_0.6s_ease-out_both] flex-col gap-6 py-12 motion-reduce:animate-none sm:py-20 lg:py-28 ${className}`.trim()}
        >
            <h1 className="text-display text-ink text-shadow-ink-muted font-mono font-bold tracking-tight uppercase text-shadow-sm">
                {profile.name}
            </h1>

            {profile.status ? (
                <StatusPill color="emerald" pulse variant="surface" size="md" className="self-start">
                    <span className="text-sm">{profile.status}</span>
                </StatusPill>
            ) : null}

            {profile.statement ? (
                <TerminalWindow prompt={prompt} text={profile.statement} className="min-h-40 max-w-2xl" />
            ) : null}

            <div className="flex flex-wrap items-center gap-4 pt-2">
                <ActionLink href="#work" variant="primary">
                    View Work
                </ActionLink>
                <ActionLink href="#contact" variant="ghost">
                    Get in touch
                </ActionLink>
            </div>
        </div>
    );
}
