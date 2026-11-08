'use client';

import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
import { errorClass, hintClass, peerLabelClass, stateLabelClass } from './form.styles';

/** The value for `aria-describedby`: points at the error while there is one, else at the hint */
export const describedBy = (id: string, error?: string, hint?: string) =>
    error ? `${id}-error` : hint ? `${id}-hint` : undefined;

/* -------------------------------------------------------------------------- */
/*  FloatingLabel                                                              */
/* -------------------------------------------------------------------------- */

type FloatingLabelProps = {
    htmlFor: string;
    children: React.ReactNode;
    required?: boolean;
    invalid?: boolean;
    /** Textareas rest at the top-left instead of the middle */
    multiline?: boolean;
    /**
     * Leave it out for inputs/textareas (the label floats by itself using the control's `peer` state).
     * Pass true/false for selects and dates, which decide when their label floats.
     */
    floated?: boolean;
};

export const FloatingLabel: React.FC<FloatingLabelProps> = ({
    htmlFor,
    children,
    required,
    invalid = false,
    multiline = false,
    floated,
}) => (
    <label
        htmlFor={htmlFor}
        className={
            floated === undefined
                ? peerLabelClass(invalid, multiline)
                : stateLabelClass(floated, invalid)
        }
    >
        {children}
        {required && (
            <span aria-hidden className="ml-0.5">
                *
            </span>
        )}
    </label>
);

/* -------------------------------------------------------------------------- */
/*  FormField: the wrapper every field uses                                    */
/* -------------------------------------------------------------------------- */

type FormFieldProps = {
    id: string;
    error?: string;
    hint?: string;
    className?: string;
    /** The control, its FloatingLabel, and any icons that sit inside it */
    children: React.ReactNode;
};

/** Positions the control + label, and shows the error or hint underneath. */
const FormField: React.FC<FormFieldProps> = ({ id, error, hint, className, children }) => {
    const reduce = useReducedMotion();

    return (
        <div className={cn('w-full', className)}>
            <div className="relative">{children}</div>

            <AnimatePresence initial={false} mode="wait">
                {error ? (
                    <motion.p
                        key="error"
                        id={`${id}-error`}
                        role="alert"
                        initial={reduce ? false : { opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={errorClass}
                    >
                        {error}
                    </motion.p>
                ) : hint ? (
                    <motion.p
                        key="hint"
                        id={`${id}-hint`}
                        initial={reduce ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={reduce ? undefined : { opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={hintClass}
                    >
                        {hint}
                    </motion.p>
                ) : null}
            </AnimatePresence>
        </div>
    );
};

export default FormField;
