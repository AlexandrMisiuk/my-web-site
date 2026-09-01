import { Container } from '@/components/layout/Container';
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
            <Container as="div">
                <div className="flex flex-col gap-1">
                    <p className="text-mono-xs text-ink font-mono font-semibold tracking-wider uppercase">
                        {profile.name}
                    </p>
                    <p className="text-mono-xs text-ink-muted font-mono">© {currentYear} · All rights reserved</p>
                </div>
            </Container>
        </footer>
    );
}
