'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { FiRotateCcw } from 'react-icons/fi';

type Line = { kind: 'cmd' | 'out' | 'item'; text: string };

const PROMPT = 'sachin@developer:~$';

const SCRIPT: Line[] = [
    { kind: 'cmd', text: 'whoami' },
    { kind: 'out', text: 'sachin@developer' },
    { kind: 'cmd', text: 'echo "Building things that matter."' },
    { kind: 'out', text: 'Building things that matter.' },
    { kind: 'cmd', text: 'ls ./stack' },
    ...['React', 'Node.js', 'TypeScript', 'APIs', 'Databases', 'Architecture'].map(
        (text): Line => ({ kind: 'item', text }),
    ),
];

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// Traffic-light dots are fixed; everything else follows the theme.
// const promptCls = 'text-emerald-600 dark:text-emerald-400';
// const outputCls = 'text-sky-600 dark:text-sky-400';

const promptCls = 'text-emerald-400';
const outputCls = 'text-sky-400';

const Cursor: React.FC<{ blink: boolean }> = ({ blink }) => (
    <motion.span
        aria-hidden
        animate={blink ? { opacity: [1, 0, 1] } : undefined}
        transition={{ duration: 1.1, repeat: Infinity }}
        className="ml-1 inline-block h-4 w-2 translate-y-0.5 bg-primary"
    />
);

const AboutTerminal: React.FC = () => {
    const reduce = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.4 });

    const [lines, setLines] = useState<Line[]>([]);
    const [typing, setTyping] = useState<string | null>(null);
    const [finished, setFinished] = useState(false);
    const [runId, setRunId] = useState(0);

    useEffect(() => {
        if (!inView) return;

        if (reduce) {
            setLines(SCRIPT);
            setTyping(null);
            setFinished(true);
            return;
        }

        let cancelled = false;

        (async () => {
            setLines([]);
            setFinished(false);

            for (const line of SCRIPT) {
                if (cancelled) return;

                if (line.kind === 'cmd') {
                    setTyping('');
                    await sleep(250);
                    for (let i = 1; i <= line.text.length; i++) {
                        if (cancelled) return;
                        setTyping(line.text.slice(0, i));
                        await sleep(45);
                    }
                    await sleep(250);
                    if (cancelled) return;
                    setTyping(null);
                    setLines((prev) => [...prev, line]);
                    await sleep(150);
                } else {
                    await sleep(line.kind === 'item' ? 110 : 120);
                    if (cancelled) return;
                    setLines((prev) => [...prev, line]);
                }
            }

            if (!cancelled) setFinished(true);
        })();

        return () => {
            cancelled = true;
        };
    }, [inView, reduce, runId]);

    const showActivePrompt = typing !== null || finished || lines.length === 0;

    return (
        <motion.div
            ref={ref}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f17] shadow-2xl shadow-indigo-950/40 backdrop-blur-xl"
        >
            {/* Title bar */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <span className="size-2.5 rounded-full bg-red-500" />
                        <span className="size-2.5 rounded-full bg-amber-400" />
                        <span className="size-2.5 rounded-full bg-emerald-500" />
                    </div>
                    <span className="font-mono text-xs text-zinc-500">
                        sachin@developer: ~
                    </span>
                </div>
                <button
                    type="button"
                    aria-label="Replay terminal"
                    onClick={() => setRunId((n) => n + 1)}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
                >
                    <FiRotateCcw className="size-4" />
                </button>
            </div>

            {/* Body: fixed min-height so typing never shifts the layout */}
            <div
                className="min-h-[21rem] overflow-x-auto px-5 py-5 font-mono text-xs leading-7 sm:text-sm"
                aria-live="off"
            >
                {lines.map((line, i) => (
                    <div key={`${runId}-${i}`} className="whitespace-pre">
                        {line.kind === 'cmd' && (
                            <>
                                <span className={promptCls}>{PROMPT}</span>{' '}
                                <span className="text-slate-100">{line.text}</span>
                            </>
                        )}
                        {line.kind === 'out' && <span className={outputCls}>{line.text}</span>}
                        {line.kind === 'item' && (
                            <span className={outputCls}>
                                <span className="text-muted-foreground">&gt;</span> {line.text}
                            </span>
                        )}
                    </div>
                ))}

                {showActivePrompt && (
                    <div className="whitespace-pre">
                        <span className={promptCls}>{PROMPT}</span>{' '}
                        <span className="text-foreground">{typing ?? ''}</span>
                        <Cursor blink={typing === null && !reduce} />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default AboutTerminal;
