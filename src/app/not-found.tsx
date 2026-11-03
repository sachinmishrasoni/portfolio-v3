"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { FiArrowLeft, FiHome } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import ShootingStarGrid from "@/components/animation/ShootingStarGrid";

// Parent staggers its children in one after another
const containerVariants: Variants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
};

// Each block rises, un-blurs and fades in
const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
};

export default function NotFound() {
    const router = useRouter();
    const reduceMotion = useReducedMotion();

    // Go back when there is history, otherwise fall back to the home page
    const handleGoBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push("/");
        }
    };

    return (
        <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-6 py-24">
            <ShootingStarGrid starCount={5} showParticles />

            <motion.div
                variants={containerVariants}
                initial={reduceMotion ? false : "hidden"}
                animate="show"
                className="relative flex max-w-xl flex-col items-center text-center"
            >
                {/* Status pill */}
                <motion.span
                    variants={itemVariants}
                    className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-md"
                >
                    <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                    Error 404
                </motion.span>

                {/* Large number with a soft glow behind it */}
                <motion.div variants={itemVariants} className="relative">
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 scale-110 rounded-full bg-gradient-to-r from-indigo-500/30 to-cyan-500/20 blur-3xl"
                    />
                    <motion.p
                        aria-hidden="true"
                        animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
                        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
                        className="bg-gradient-to-b from-foreground to-foreground/10 bg-clip-text font-heading text-[clamp(6rem,22vw,11rem)] font-extrabold leading-none tracking-tighter text-transparent"
                    >
                        404
                    </motion.p>
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="mt-4 font-heading text-2xl font-bold sm:text-3xl"
                >
                    Page not found
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base"
                >
                    The page you are looking for does not exist, was moved, or the link
                    is no longer valid.
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="mt-8 flex flex-wrap items-center justify-center gap-3"
                >
                    {/* asChild */}
                    <Button size="lg" className="rounded-full">
                        <FiHome />
                        Back to home
                    </Button>

                    <Button
                        size="lg"
                        variant="outline"
                        className="rounded-full hover:border-primary dark:hover:border-primary"
                        onClick={handleGoBack}
                    >
                        <FiArrowLeft />
                        Go back
                    </Button>
                </motion.div>
            </motion.div>
        </main>
    );
}