import { ActionLink } from '@/components/ui/ActionLink';
import { StatusPill } from '@/components/ui/StatusPill';
import { siteProfile as defaultSiteProfile } from '@/data/site';
import type { SiteProfile } from '@/data/types';

export interface HeroProps {
    profile?: SiteProfile;
    className?: string;
}

export function Hero({ profile = defaultSiteProfile, className = '' }: HeroProps) {
    const statementText = [profile.role, profile.statement].filter(Boolean).join(' — ');

    return (
        <div
            className={`flex animate-[hero-rise_0.6s_ease-out_both] flex-col gap-6 py-12 motion-reduce:animate-none sm:py-20 lg:py-28 ${className}`.trim()}
        >
            {profile.status ? (
                <StatusPill color="emerald" pulse variant="surface" size="md" className="self-start">
                    {profile.status}
                </StatusPill>
            ) : null}

            <h1 className="text-display text-ink font-bold tracking-tight">{profile.name}</h1>

            {statementText ? <p className="text-lead text-ink-muted max-w-2xl">{statementText}</p> : null}

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
