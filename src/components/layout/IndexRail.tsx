import { navItems } from '@/data/navigation';

export interface IndexRailProps {
    activeId: string;
}

export function IndexRail({ activeId }: IndexRailProps) {
    return (
        <aside
            aria-hidden="true"
            className="pointer-events-none fixed top-1/2 left-6 z-30 hidden -translate-y-1/2 flex-col gap-4 xl:flex"
        >
            {navItems.map((item) => {
                const isActive = activeId === item.id;
                return (
                    <div key={item.id} className="flex items-center gap-2.5">
                        <span
                            className={`text-mono-xs font-mono transition-colors duration-200 motion-reduce:transition-none ${
                                isActive ? 'text-accent font-semibold' : 'text-ink-muted/50'
                            }`}
                        >
                            {item.index}
                        </span>
                        <span
                            className={`h-[1.5px] rounded-full transition-all duration-300 motion-reduce:transition-none ${
                                isActive ? 'bg-accent w-7' : 'bg-hairline w-3'
                            }`}
                        />
                    </div>
                );
            })}
        </aside>
    );
}
