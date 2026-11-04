'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import ShootingStarGrid from '@/components/common/ShootingStarGrid';
import HeroLeft from './Heroleft';
import HeroRight from './Heroright';

const HeroSection: React.FC = () => {
    const reduce = useReducedMotion();

    return (
        <section
            id="home"
            data-testid="hero-section"
            className="relative isolate flex min-h-svh items-center overflow-hidden pb-20 pt-28"
        >
            <ShootingStarGrid />

            <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 lg:px-6 lg:grid-cols-12">
                <div className="lg:col-span-7">
                    <HeroLeft />
                </div>
                <div className="lg:col-span-5">
                    <HeroRight />
                </div>
            </div>

            {/* Scroll indicator */}
            <a
                href="#skills"
                aria-label="Scroll to next section"
                className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
            >
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                    Scroll
                </span>
                <span className="relative h-8 w-px overflow-hidden bg-white/10">
                    <motion.span
                        className="absolute inset-x-0 top-0 h-3 bg-indigo-400"
                        animate={reduce ? undefined : { y: [-12, 32] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </span>
            </a>
        </section>
    );
};

export default HeroSection;