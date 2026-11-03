'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Service } from './services.data';
import SpotlightCard from '@/components/common/SpotlightCard';

const EASE = [0.22, 1, 0.36, 1] as const;

type ServiceCardProps = {
    service: Service;
    /** Position in the grid, used to stagger the entrance */
    index: number;
};

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
    const reduce = useReducedMotion();
    const Icon = service.icon;

    return (
        <motion.li
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={reduce ? undefined : { y: -6 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: EASE, delay: (index % 3) * 0.08 }}
            className="h-full"
        >
            <SpotlightCard className="flex h-full flex-col">
                <div className="group flex h-full flex-col rounded-2xl border border-border bg-card p-4 transition-[border-color,box-shadow] duration-300 hover:border-primary/40 hover:shadow-[0_0_25px_color-mix(in_srgb,bg-primary_10%,transparent)] sm:p-6">
                    <span className="flex size-11 items-center justify-center rounded-xl border border-border bg-background text-xl text-primary transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                        <Icon aria-hidden />
                    </span>

                    <h3 className="mt-4 text-xl font-semibold leading-snug text-foreground">
                        {service.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {service.description}
                    </p>

                    {/* Tags pinned to the bottom so cards in a row line up */}
                    <ul className="mt-auto flex flex-wrap gap-2 pt-6">
                        {service.tags.map((tag) => (
                            <li
                                key={tag}
                                className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 font-mono text-xs text-foreground"
                            >
                                {tag}
                            </li>
                        ))}
                    </ul>
                </div>
            </SpotlightCard>
        </motion.li>
    );
};

export default ServiceCard;
