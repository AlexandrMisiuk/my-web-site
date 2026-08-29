import heroLightBg from '@/assets/hero-light.jpeg';
import heroDarkBg from '@/assets/hero-dark.jpeg';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { IndexRail } from '@/components/layout/IndexRail';
import { Section, SectionBackground } from '@/components/layout/Section';
import { SkipLink } from '@/components/layout/SkipLink';
import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { Hero } from '@/components/sections/Hero';
import { HowIWork } from '@/components/sections/HowIWork';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { Technologies } from '@/components/sections/Technologies';
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
                <Section
                    id="hero"
                    variant="plain"
                    background={<SectionBackground light={heroLightBg} dark={heroDarkBg} priority />}
                >
                    <Hero />
                </Section>

                {/* 01 / Selected Work */}
                <Section id="work" index="01" label="Selected Work">
                    <SelectedWork />
                </Section>

                {/* 02 / How I Work */}
                <Section id="how-i-work" index="02" label="How I Work">
                    <HowIWork />
                </Section>

                {/* 03 / About */}
                <Section id="about" index="03" label="About">
                    <About />
                </Section>

                {/* 04 / Technologies */}
                <Section id="technologies" index="04" label="Technologies">
                    <Technologies />
                </Section>

                {/* 05 / Contact */}
                <Section id="contact" index="05" label="Contact">
                    <Contact />
                </Section>
            </main>

            <Footer />
        </div>
    );
}
