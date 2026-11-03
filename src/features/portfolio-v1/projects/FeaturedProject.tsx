'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { FiArrowUpRight, FiGithub } from 'react-icons/fi';
import SpotlightCard from '@/components/common/SpotlightCard';
import ProjectImage, { PlaceholderBadge } from './ProjectImage';
import type { Project } from './projects.data';
import { buttonVariants } from '@/components/ui/button';

const EASE = [0.22, 1, 0.36, 1] as const;

const FeaturedProject: React.FC<{ project: Project }> = ({ project }) => {
    const reduce = useReducedMotion();

    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: EASE }}
        >
            <SpotlightCard size={520} className="grid lg:grid-cols-2">
                {/* Image */}
                <div className="relative min-h-64 overflow-hidden lg:min-h-[26rem]">
                    <ProjectImage
                        project={project}
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        priority
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                            Featured Project
                        </span>
                        {project.placeholder && <PlaceholderBadge />}
                    </div>

                    <h3 className="mt-4 text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                        {project.title}
                    </h3>

                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {project.description}
                    </p>

                    <ul className="mt-6 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                            <li
                                key={tag}
                                className="rounded-lg border border-border bg-secondary/60 px-2.5 py-1 font-mono text-xs text-foreground"
                            >
                                {tag}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        {project.demo && (
                            <a
                                href={project.demo}
                                target="_blank"
                                rel="noreferrer"
                                // className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                                className={buttonVariants({ variant: "default" })}
                            >
                                View Project
                                <FiArrowUpRight />
                            </a>
                        )}
                        {project.github && (
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noreferrer"
                                // className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background/60 px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                                className={buttonVariants({ variant: "outline" })}
                            >
                                <FiGithub />
                                GitHub
                            </a>
                        )}
                        <Link
                            href={`/projects/${project.slug}`}
                            // className="inline-flex h-10 items-center rounded-xl px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary"
                            className={buttonVariants({ variant: "ghost" })}
                        >
                            View Details
                        </Link>
                    </div>
                </div>
            </SpotlightCard>
        </motion.div>
    );
};

export default FeaturedProject;
