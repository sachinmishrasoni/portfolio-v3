'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { FiCheck, FiCopy, FiLoader, FiPlay } from 'react-icons/fi';
import { CODE_LINES, CODE_TEXT, RUN_COMMAND, RUN_ENTRY, type TokenKind } from './profile.data';
import { runCode } from './runCode';

const EASE = [0.22, 1, 0.36, 1] as const;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

type Phase = 'idle' | 'typing' | 'running' | 'done' | 'error';

// Syntax colours with a darker shade in light mode so the code stays readable in both themes
const TOKEN_CLASS: Record<TokenKind, string> = {
    keyword: 'text-violet-600 dark:text-violet-400',
    class: 'text-amber-600 dark:text-amber-300',
    prop: 'text-sky-600 dark:text-sky-300',
    fn: 'text-sky-600 dark:text-sky-300',
    string: 'text-emerald-600 dark:text-emerald-400',
    punct: 'text-muted-foreground',
    plain: 'text-foreground',
};

const codeContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
};

const codeLine: Variants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } },
};

const CodeWindow: React.FC = () => {
    const reduce = useReducedMotion();

    const [phase, setPhase] = useState<Phase>('idle');
    const [typed, setTyped] = useState('');
    const [output, setOutput] = useState<string[]>([]);
    const [elapsed, setElapsed] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    // Every run gets an id; a newer run (or unmounting) cancels the older one mid-way
    const runToken = useRef(0);
    useEffect(
        () => () => {
            runToken.current++;
        },
        [],
    );

    const busy = phase === 'typing' || phase === 'running';

    const handleRun = async () => {
        if (busy) return;
        const id = ++runToken.current;
        const alive = () => runToken.current === id;

        setOutput([]);
        setElapsed(null);
        setTyped('');
        setPhase('typing');

        // 1. "type" the command into the console
        if (reduce) {
            setTyped(RUN_COMMAND);
        } else {
            for (let i = 1; i <= RUN_COMMAND.length; i++) {
                if (!alive()) return;
                setTyped(RUN_COMMAND.slice(0, i));
                await sleep(35);
            }
        }
        if (!alive()) return;

        // 2. brief "running" state, then actually execute the code shown in the editor
        setPhase('running');
        await sleep(reduce ? 0 : 700);
        if (!alive()) return;

        const result = runCode(CODE_TEXT, RUN_ENTRY);
        if (result.ok) {
            setOutput(result.lines);
            setElapsed(result.ms);
            setPhase('done');
        } else {
            setOutput([result.error]);
            setPhase('error');
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(CODE_TEXT);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            // Clipboard can be blocked (e.g. non-secure context); nothing useful to show
        }
    };

    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d0f17]/95 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl"
        >
            {/* Title bar */}
            <div className="flex items-stretch justify-between border-b border-white/10 px-5 py-3">
                <div className="flex items-center gap-5">
                    <div className="flex gap-2">
                        <span className="size-2.5 rounded-full bg-red-500" />
                        <span className="size-2.5 rounded-full bg-amber-400" />
                        <span className="size-2.5 rounded-full bg-emerald-500" />
                    </div>

                    {/* File tab */}
                    <div className="relative flex items-center gap-2 font-mono text-xs text-foreground">
                        <span className="size-1.5 rounded-full bg-primary" />
                        sachin.ts
                        <span aria-hidden className="absolute inset-x-0 -bottom-1 h-px bg-primary" />
                    </div>
                </div>

                <div className="flex items-center gap-1 text-sm">
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground cursor-pointer transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
                    >
                        {copied ? <FiCheck className="text-emerald-500" /> : <FiCopy />}
                        <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleRun}
                        disabled={busy}
                        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-emerald-600 cursor-pointer transition-colors hover:bg-emerald-500/10 focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60 dark:text-emerald-400"
                    >
                        {busy ? <FiLoader className="animate-spin" /> : <FiPlay />}
                        {busy ? 'Running' : 'Run'}
                    </button>
                </div>
            </div>

            {/* Code */}
            <pre className="overflow-x-auto px-4 py-6 font-mono text-[11px] leading-7 sm:px-6">
                <motion.code
                    variants={codeContainer}
                    initial={reduce ? 'show' : 'hidden'}
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    className="block"
                >
                    {CODE_LINES.map((tokens, i) => (
                        <motion.span key={i} variants={codeLine} className="flex gap-5 sm:gap-6">
                            <span
                                aria-hidden
                                className="w-5 shrink-0 select-none text-right text-muted-foreground/50"
                            >
                                {i + 1}
                            </span>
                            <span className="whitespace-pre">
                                {tokens.map(([kind, text], j) => (
                                    <span key={j} className={TOKEN_CLASS[kind]}>
                                        {text}
                                    </span>
                                ))}
                                {/* keeps empty lines at full height */}
                                {tokens.length === 0 && ' '}
                            </span>
                        </motion.span>
                    ))}
                </motion.code>
            </pre>

            {/* Console: stays closed until Run is clicked */}
            <motion.div
                initial={false}
                animate={{ height: phase === 'idle' ? 0 : 'auto' }}
                transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                className="overflow-hidden"
            >
                <div
                    role="log"
                    aria-live="polite"
                    aria-label="Console output"
                    className="border-t border-border bg-background/40 px-4 py-5 font-mono text-xs leading-7 sm:px-6 sm:text-sm"
                >
                    {/* The command being "typed" */}
                    <div className="whitespace-pre text-muted-foreground">
                        {typed}
                        {phase === 'typing' && (
                            <motion.span
                                aria-hidden
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 bg-primary"
                            />
                        )}
                    </div>

                    {phase === 'running' && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <FiLoader className="animate-spin" />
                            Executing…
                        </div>
                    )}

                    {(phase === 'done' || phase === 'error') &&
                        output.map((line, i) => (
                            <motion.div
                                key={i}
                                initial={reduce ? false : { opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.3, ease: EASE }}
                                className={`whitespace-pre ${
                                    phase === 'error'
                                        ? 'text-red-600 dark:text-red-400'
                                        : 'text-emerald-600 dark:text-emerald-400'
                                }`}
                            >
                                {line}
                            </motion.div>
                        ))}

                    {phase === 'done' && elapsed !== null && (
                        <motion.div
                            initial={reduce ? false : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: output.length * 0.1 + 0.1 }}
                            className="mt-2 text-xs text-muted-foreground"
                        >
                            ✓ executed in {elapsed.toFixed(1)} ms
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CodeWindow;
