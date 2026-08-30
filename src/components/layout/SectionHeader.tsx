export interface SectionHeaderProps {
    label: string;
    headingId: string;
    className?: string;
}

export function SectionHeader({ label, headingId, className = '' }: SectionHeaderProps) {
    return (
        <header className={`flex flex-col gap-3 ${className}`.trim()}>
            <div className="border-hairline border-t" />
            <h2 id={headingId} className="text-h2 text-ink font-semibold tracking-tight">
                {label}
            </h2>
        </header>
    );
}
