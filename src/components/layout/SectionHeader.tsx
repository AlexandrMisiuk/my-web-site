import { Eyebrow } from '@/components/ui/Eyebrow';

export interface SectionHeaderProps {
    index: string;
    label: string;
    headingId: string;
    className?: string;
}

export function SectionHeader({ index, label, headingId, className = '' }: SectionHeaderProps) {
    return (
        <header className={`flex flex-col gap-3 ${className}`.trim()}>
            <Eyebrow as="p">
                {index} / {label}
            </Eyebrow>
            <div className="border-hairline border-t" />
            <h2 id={headingId} className="text-h2 text-ink font-sans font-semibold tracking-tight">
                {label}
            </h2>
        </header>
    );
}
