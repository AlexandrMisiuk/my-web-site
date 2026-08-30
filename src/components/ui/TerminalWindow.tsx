import { useRef, type ReactElement } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export interface TerminalWindowProps {
    prompt?: string;
    text: string;
    title?: string;
    typingSpeed?: number;
    className?: string;
    'data-testid'?: string;
}

export function TerminalWindow({
    prompt,
    text,
    title,
    typingSpeed = 0.05,
    className = '',
    'data-testid': dataTestId,
}: TerminalWindowProps): ReactElement {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const cursorRef = useRef<HTMLSpanElement>(null);

    const windowTitle = title ? `Terminal - ${title}` : 'Terminal';

    useGSAP(
        () => {
            const isReducedMotion =
                typeof window !== 'undefined' &&
                Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

            if (isReducedMotion) {
                textRef.current!.textContent = text;
                gsap.set(cursorRef.current!, { opacity: 1 });
                return;
            }

            if (!text) {
                textRef.current!.textContent = '';
                return;
            }

            const state = { length: 0 };
            const textElement = textRef.current!;

            gsap.to(state, {
                length: text.length,
                duration: text.length * typingSpeed,
                ease: 'none',
                onUpdate: () => {
                    textElement.textContent = text.slice(0, Math.round(state.length));
                },
            });

            gsap.to(cursorRef.current!, {
                opacity: 0,
                repeat: -1,
                yoyo: true,
                duration: 0.53,
                ease: 'steps(1)',
            });
        },
        { scope: containerRef, dependencies: [text, typingSpeed], revertOnUpdate: true },
    );

    return (
        <div
            ref={containerRef}
            data-testid={dataTestId}
            className={`border-hairline bg-surface text-ink overflow-hidden rounded-sm border font-mono shadow-xs sm:shadow-sm ${className}`.trim()}
        >
            <div className="bg-canvas/60 border-hairline flex items-center justify-between border-b px-4 py-2.5">
                <div className="flex items-center gap-2" aria-hidden="true">
                    <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                    <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                    <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-ink-muted truncate px-2 font-mono text-xs select-none">{windowTitle}</span>
                <div className="hidden w-14 shrink-0 sm:block" aria-hidden="true" />
            </div>
            <div className="p-4 text-sm leading-relaxed sm:p-5 sm:text-base">
                {prompt ? <span className="text-accent mr-2 font-semibold select-none">{prompt}</span> : null}
                <span ref={textRef} className="text-ink">
                    {text}
                </span>
                <span
                    ref={cursorRef}
                    className="bg-accent ml-1 inline-block h-4.5 w-2 translate-y-0.5"
                    aria-hidden="true"
                />
            </div>
        </div>
    );
}
