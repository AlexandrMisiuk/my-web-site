import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Section } from '@/components/layout/Section';
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

            <main id="main" tabIndex={-1} className="outline-none">
                {/* Hero */}
                <Section id="hero" variant="plain" className="justify-center">
                    <Hero />
                </Section>

                {/* Selected Work */}
                <Section id="work" label="Selected Work">
                    <SelectedWork />
                </Section>

                {/* How I Work */}
                <Section id="how-i-work" label="How I Work">
                    <HowIWork />
                </Section>

                {/* About */}
                <Section id="about" label="About">
                    <About />
                </Section>

                {/* Technologies */}
                <Section id="technologies" label="Technologies">
                    <Technologies />
                </Section>

                {/* Contact */}
                <Section id="contact" label="Contact">
                    <Contact />
                </Section>
            </main>

            <Footer />
        </div>
    );
}
