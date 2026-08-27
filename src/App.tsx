import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { IndexRail } from '@/components/layout/IndexRail';
import { Section } from '@/components/layout/Section';
import { SkipLink } from '@/components/layout/SkipLink';
import { Hero } from '@/components/sections/Hero';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { SECTION_IDS } from '@/data/navigation';
import { useActiveSection } from '@/hooks/useActiveSection';

export default function App() {
    const activeId = useActiveSection(SECTION_IDS);

    return (
        <div className="bg-canvas text-ink relative min-h-screen antialiased">
            <SkipLink />
            <Header activeId={activeId} />
            <IndexRail activeId={activeId} />

            <main id="main" tabIndex={-1} className="outline-none">
                {/* 00 / Hero */}
                <Section id="hero" variant="plain">
                    <Hero />
                </Section>

                {/* 01 / Selected Work */}
                <Section id="work" index="01" label="Selected Work">
                    <SelectedWork />
                </Section>

                {/* 02 / How I Work */}
                <Section id="how-i-work" index="02" label="How I Work">
                    <p className="text-mono-xs text-ink-muted font-mono">[Engineering principles arriving in Step 6]</p>
                </Section>

                {/* 03 / About */}
                <Section id="about" index="03" label="About">
                    <p className="text-mono-xs text-ink-muted font-mono">
                        [Biography and background arriving in Step 6]
                    </p>
                </Section>

                {/* 04 / Technologies */}
                <Section id="technologies" index="04" label="Technologies">
                    <p className="text-mono-xs text-ink-muted font-mono">
                        [Technical stack and tooling matrix arriving in Step 6]
                    </p>
                </Section>

                {/* 05 / Contact */}
                <Section id="contact" index="05" label="Contact">
                    <p className="text-mono-xs text-ink-muted font-mono">
                        [Contact and availability details arriving in Step 6]
                    </p>
                </Section>
            </main>

            <Footer />
        </div>
    );
}
