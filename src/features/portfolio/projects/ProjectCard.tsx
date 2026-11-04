'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { FiArrowUpRight, FiGithub } from 'react-icons/fi';
import SpotlightCard from '@/components/common/SpotlightCard';
import ProjectImage, { PlaceholderBadge } from './ProjectImage';
import type { Project } from './projects.data';

const EASE = [0.22, 1, 0.36, 1] as const;

type ProjectCardProps = {
    project: Project;
    /** 0-based position in the grid; shown as "01", "02"… and used to stagger the entrance */
    index: number;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
    const reduce = useReducedMotion();

    return (
        <motion.li
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={reduce ? undefined : { y: -4 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: EASE, delay: (index % 3) * 0.08 }}
            className="h-full"
        >
            <SpotlightCard className="flex h-full flex-col">
                {/* Image */}
                <div className="relative h-44 shrink-0 overflow-hidden">
                    <ProjectImage
                        project={project}
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                    <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent"
                    />
                    <span className="absolute left-4 top-3 font-mono text-xs text-foreground/80">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    {project.placeholder && <PlaceholderBadge className="absolute right-3 top-3" />}
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-semibold leading-snug text-foreground">
                        {project.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {project.description}
                    </p>

                    <ul className="my-4 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                            <li
                                key={tag}
                                className="rounded-full border border-border bg-secondary/60 px-2 py-0.5 font-mono text-[11px] text-foreground"
                            >
                                {tag}
                            </li>
                        ))}
                    </ul>

                    {/* Footer pinned to the bottom so cards of different heights line up */}
                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4 text-sm">
                        <div className="flex items-center gap-4">
                            {project.github && (
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    <FiGithub />
                                    GitHub
                                </a>
                            )}
                            {project.demo && (
                                <a
                                    href={project.demo}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-primary transition-opacity hover:opacity-80"
                                >
                                    Live Demo
                                    <FiArrowUpRight />
                                </a>
                            )}
                        </div>
                        <Link
                            href={`/projects/${project.slug}`}
                            className="text-foreground transition-colors hover:text-primary"
                        >
                            View Details
                        </Link>
                    </div>
                </div>
            </SpotlightCard>
        </motion.li>
    );
};

export default ProjectCard;
