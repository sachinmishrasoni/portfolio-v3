'use client';

import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
import {
    errorClass,
    hintClass,
    peerLabelClass,
    stateLabelClass,
    topLabelClass,
} from './form.styles';
import type { FieldVariant } from './form.types';

export const describedBy = (id: string, error?: string, hint?: string) =>
    error ? `${id}-error` : hint ? `${id}-hint` : undefined;

/* ------------------------------ FloatingLabel ------------------------------ */

type FloatingLabelProps = {
    htmlFor: string;
    children: React.ReactNode;
    required?: boolean;
    invalid?: boolean;
    multiline?: boolean;
    /** Leave out for inputs/textareas (they float via `peer`). Pass true/false for selects and dates. */
    floated?: boolean;
    variant?: FieldVariant;
};

export const FloatingLabel: React.FC<FloatingLabelProps> = ({
    htmlFor,
    children,
    required,
    invalid = false,
    multiline = false,
    floated,
    variant = 'floating',
}) => {
    const className =
        variant === 'top'
            ? topLabelClass(invalid)
            : floated === undefined
              ? peerLabelClass(invalid, multiline, variant)
              : stateLabelClass(floated, invalid, variant);

    return (
        <label htmlFor={htmlFor} className={className}>
            {children}
            {required && (
                <span aria-hidden className="ml-0.5">
                    *
                </span>
            )}
        </label>
    );
};

/* -------------------------------- FormField -------------------------------- */

type FormFieldProps = {
    id: string;
    label: string;
    required?: boolean;
    variant?: FieldVariant;
    /** Selects/dates only: whether the label is floated. Leave out for inputs/textareas. */
    floated?: boolean;
    multiline?: boolean;
    error?: string;
    hint?: string;
    className?: string;
    /** The control and any icons that sit inside it (the label is added for you) */
    children: React.ReactNode;
};

const FormField: React.FC<FormFieldProps> = ({
    id,
    label,
    required,
    variant = 'floating',
    floated,
    multiline,
    error,
    hint,
    className,
    children,
}) => {
    const reduce = useReducedMotion();

    const labelNode = (
        <FloatingLabel
            htmlFor={id}
            required={required}
            invalid={Boolean(error)}
            multiline={multiline}
            floated={floated}
            variant={variant}
        >
            {label}
        </FloatingLabel>
    );

    return (
        <div className={cn('group/field w-full', className)}>
            {variant === 'top' && labelNode}

            {/* The control must come BEFORE the label so the `peer` selectors work */}
            <div className="relative">
                {children}
                {variant !== 'top' && labelNode}
            </div>

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
