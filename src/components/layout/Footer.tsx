'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { FiArrowUp } from 'react-icons/fi';
import { CONTACT_LINKS } from '@/features/portfolio-v1/contact/contact.data';
import { IoLocationOutline } from 'react-icons/io5';
// Reuses the same links as the Contact section (GitHub, LinkedIn, Email). Adjust the path if yours differs.
// import { CONTACT_LINKS } from '@/components/contact/contact.data';

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const FOOTER_NAME = 'Sachin Mishra Soni';
const FOOTER_ROLE = 'Full-Stack Developer';
const FOOTER_STACK = ['React', 'Node', 'TypeScript', 'APIs'];
const FOOTER_STATUS = 'Available for opportunities';
const FOOTER_TAGLINE = 'Built with React & curiosity.';

const Footer: React.FC = () => {
    const reduce = useReducedMotion();
    // const year = new Date().getFullYear();
    const [year, setYear] = useState<number | null>(null);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);


    const scrollToTop = () => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });

    return (
        <footer data-testid="footer" className="relative border-t border-border">
            <motion.div
                variants={container}
                initial={reduce ? 'show' : 'hidden'}
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                className="mx-auto w-full max-w-7xl px-6"
            >
                {/* Top row: identity on the left, status + socials on the right */}
                <div className="flex flex-col gap-10 py-12 sm:flex-row sm:items-start sm:justify-between lg:py-16">
                    <motion.div variants={fadeUp}>
                        <p className="text-xl font-bold tracking-tight text-foreground">
                            {FOOTER_NAME}
                        </p>
                        <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            {FOOTER_ROLE}
                        </p>

                        <p className="mt-1.5 inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
                            <IoLocationOutline aria-hidden="true" className="shrink-0 text-primary" />
                            <span>Karol Bagh, New Delhi, India</span>
                        </p>

                        <ul className="mt-4 flex flex-wrap items-center gap-x-2 font-mono text-[11px] text-muted-foreground">
                            {FOOTER_STACK.map((item, i) => (
                                <li key={item} className="flex items-center gap-2">
                                    {i > 0 && <span aria-hidden>•</span>}
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        variants={fadeUp}
                        className="flex flex-col items-start gap-5 sm:items-end"
                    >
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                            <span className="relative flex size-1.5">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                            </span>
                            {FOOTER_STATUS}
                        </span>

                        <ul className="flex items-center gap-3">
                            {CONTACT_LINKS.map(({ id, label, href, icon: Icon, external }) => (
                                <li key={id}>
                                    <motion.a
                                        href={href}
                                        aria-label={label}
                                        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                                        whileHover={reduce ? undefined : { y: -3 }}
                                        whileTap={reduce ? undefined : { scale: 0.95 }}
                                        className="flex size-9 items-center justify-center rounded-lg border border-border bg-card/60 text-base text-foreground transition-colors hover:border-primary/40 hover:bg-card hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                                    >
                                        <Icon aria-hidden />
                                    </motion.a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Bottom row: copyright + back to top */}
                <motion.div
                    variants={fadeUp}
                    className="flex flex-col items-center gap-4 border-t border-border py-6 sm:flex-row sm:items-center sm:justify-between"
                >
                    <p className="font-mono text-[11px] text-muted-foreground text-center">
                        © {year ?? "2026"} {FOOTER_NAME} · {FOOTER_TAGLINE}
                    </p>

                    <button
                        type="button"
                        onClick={scrollToTop}
                        className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground cursor-pointer transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:self-auto"
                    >
                        Back to top
                        <span className="flex size-8 items-center justify-center rounded-lg border border-border bg-card/60 text-sm text-foreground transition-colors group-hover:border-primary/40">
                            <FiArrowUp className="transition-transform duration-300 group-hover:-translate-y-0.5" />
                        </span>
                    </button>
                </motion.div>
            </motion.div>
        </footer>
    );
};

export default Footer;