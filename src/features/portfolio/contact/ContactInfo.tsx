'use client';

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { FiArrowUpRight } from 'react-icons/fi';
import { CONTACT_LINKS, LOCATION } from './contact.data';

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const lineReveal: Variants = {
    hidden: { y: '110%' },
    show: { y: 0, transition: { duration: 0.8, ease: EASE } },
};

const Line: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = '',
}) => (
    <span className="block overflow-hidden pb-1">
        <motion.span variants={lineReveal} className={`block ${className}`}>
            {children}
        </motion.span>
    </span>
);

const ContactInfo: React.FC = () => {
    const reduce = useReducedMotion();

    return (
        <motion.div
            variants={container}
            initial={reduce ? 'show' : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
        >
            <motion.p
                variants={fadeUp}
                className="font-mono text-xs uppercase tracking-[0.25em] text-primary"
            >
                {'//'} 07 · Contact
            </motion.p>

            <h2 className="mt-4 text-4xl font-extrabold uppercase leading-[0.98] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                <Line>Let’s build</Line>
                <Line>something</Line>
                <Line>
                    <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
                        great
                    </span>
                    <span className="text-sky-500">.</span>
                </Line>
            </h2>

            <motion.p
                variants={fadeUp}
                className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
                Have an idea, project or opportunity? Let’s talk.
            </motion.p>

            <ul className="mt-10 space-y-3">
                {CONTACT_LINKS.map(({ id, label, href, icon: Icon, external }) => (
                    <motion.li key={id} variants={fadeUp}>
                        <a
                            href={href}
                            {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                            className="group flex items-center justify-between rounded-2xl border border-border bg-card/60 px-5 py-4 text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:max-w-md"
                        >
                            <span className="flex items-center gap-4">
                                <Icon className="size-4.5 text-primary" aria-hidden />
                                <span className="text-sm font-medium">{label}</span>
                            </span>
                            <FiArrowUpRight
                                aria-hidden
                                className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                        </a>
                    </motion.li>
                ))}
            </ul>

            {/* <motion.p variants={fadeUp} className="mt-6 font-mono text-sm text-muted-foreground">
                {LOCATION}
            </motion.p> */}
        </motion.div>
    );
};

export default ContactInfo;
