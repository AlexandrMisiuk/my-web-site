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
    return (
        <div
            className={`flex animate-[hero-rise_0.6s_ease-out_both] flex-col gap-6 motion-reduce:animate-none ${className}`.trim()}
        >
            <div className="flex flex-col gap-2">
                <h1 className="text-ink font-mono text-4xl font-bold tracking-tight uppercase sm:text-5xl lg:text-6xl">
                    {profile.name}
                </h1>
                {profile.role ? (
                    <h2 className="text-lead sm:text-h3 text-ink-muted font-mono font-medium tracking-tight">
                        {profile.role}
                    </h2>
                ) : null}
            </div>

            {profile.status ? (
                <StatusPill color="emerald" pulse variant="surface" size="md" className="self-start">
                    <span className="text-sm">{profile.status}</span>
                </StatusPill>
            ) : null}

            {profile.statement ? (
                <TerminalWindow
                    prompt="alex ~ %"
                    text={profile.statement}
                    className="min-h-40 sm:max-w-xl md:max-w-2xl md:min-w-2xl"
                />
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
