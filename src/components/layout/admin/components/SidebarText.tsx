'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

type SidebarTextProps = {
    show: boolean;
    children: React.ReactNode;
    className?: string;
};

/** Fades with the sidebar. On expand it waits a moment so the text appears after the width has grown. */
const SidebarText: React.FC<SidebarTextProps> = ({ show, children, className }) => {
    const reduce = useReducedMotion();

    return (
        <motion.span
            initial={false}
            animate={{ opacity: show ? 1 : 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.15, delay: show ? 0.12 : 0 }}
            aria-hidden={!show}
            className={cn('whitespace-nowrap', className)}
        >
            {children}
        </motion.span>
    );
};

export default SidebarText;