"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { cn } from "@/lib/utils";
import type { AlertType } from "@/components/common/alert/alert";
import { alertStyles as s, alertTypeStyles } from "./alert.styles";

const icons: Record<AlertType, React.ElementType> = {
    confirm: TriangleAlert,
    success: CheckCircle2,
    error: AlertCircle,
    warning: TriangleAlert,
    info: Info,
};

// Parent staggers its children in; shadcn handles the dialog open/close itself.
const bodyVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

const iconVariants: Variants = {
    hidden: { scale: 0, rotate: -45, opacity: 0 },
    visible: {
        scale: 1,
        rotate: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 380, damping: 14, delay: 0.1 },
    },
};

export interface AlertModalProps {
    open: boolean;
    type: AlertType;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function AlertModal({
    open,
    type,
    title,
    description,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
}: AlertModalProps) {
    const reduceMotion = useReducedMotion();
    const t = alertTypeStyles[type];
    const Icon = icons[type];

    return (
        <AlertDialog
            open={open}
            onOpenChange={(next) => {
                if (!next) onCancel();
            }}
        >
            <AlertDialogContent className={s.content}>
                <motion.div
                    className={s.accentBar + " " + t.accent}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                />

                <motion.div
                    className={s.body}
                    variants={bodyVariants}
                    initial={reduceMotion ? false : "hidden"}
                    animate="visible"
                >
                    <motion.div variants={iconVariants} className={s.iconRoot}>
                        {!reduceMotion && (
                            <motion.span
                                className={cn(s.iconRing, t.iconRing)}
                                animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
                                transition={{
                                    duration: 1.6,
                                    repeat: Infinity,
                                    ease: "easeOut",
                                }}
                            />
                        )}
                        <motion.div
                            className={cn(s.iconCircle, t.iconCircle)}
                            animate={
                                type === "error" && !reduceMotion
                                    ? { x: [0, -6, 6, -4, 4, 0] }
                                    : undefined
                            }
                            transition={{ delay: 0.35, duration: 0.45 }}
                        >
                            <Icon className={s.icon} strokeWidth={2.2} />
                        </motion.div>
                    </motion.div>

                    <AlertDialogHeader className={s.header}>
                        <motion.div variants={itemVariants} className={s.headerItem}>
                            <AlertDialogTitle className={s.title}>
                                {title || t.defaultTitle}
                            </AlertDialogTitle>
                        </motion.div>

                        {description && (
                            <motion.div variants={itemVariants} className={s.headerItem}>
                                <AlertDialogDescription className={s.description}>
                                    {description}
                                </AlertDialogDescription>
                            </motion.div>
                        )}
                    </AlertDialogHeader>

                    <motion.div variants={itemVariants} className={s.footerWrap}>
                        <AlertDialogFooter className={s.footer}>
                            {type === "confirm" && (
                                <motion.div
                                    className={s.buttonWrap}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.96 }}
                                >
                                    <AlertDialogCancel
                                        className={cn(s.button, s.cancelButton)}
                                    >
                                        {cancelText ?? "Cancel"}
                                    </AlertDialogCancel>
                                </motion.div>
                            )}

                            <motion.div
                                className={s.buttonWrap}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.96 }}
                            >
                                <AlertDialogAction
                                    className={cn(s.button, t.confirmButton)}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onConfirm();
                                    }}
                                >
                                    {confirmText ?? t.defaultConfirmText}
                                </AlertDialogAction>
                            </motion.div>
                        </AlertDialogFooter>
                    </motion.div>
                </motion.div>
            </AlertDialogContent>
        </AlertDialog>
    );
}
