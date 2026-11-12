'use client';

import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { FiAlertCircle } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import {
    errorClass,
    hintClass,
    outlinedLabelClass,
    requiredMarkClass,
    topLabelClass,
} from './form.styles';
import type { FieldSize, FieldVariant } from './form.types';

export const describedBy = (id: string, error?: string, hint?: string) =>
    error ? `${id}-error` : hint ? `${id}-hint` : undefined;

/* ------------------------------ FloatingLabel ------------------------------ */

type FloatingLabelProps = {
    htmlFor: string;
    children: React.ReactNode;
    required?: boolean;
    invalid?: boolean;
    variant?: FieldVariant;
    size?: FieldSize;
    /** outlined + textarea: label rests at the top instead of the middle */
    multiline?: boolean;
    /** outlined + select/date only: whether the label is floated. Leave out for inputs/textareas. */
    floated?: boolean;
};

export const FloatingLabel: React.FC<FloatingLabelProps> = ({
    htmlFor,
    children,
    required,
    invalid = false,
    variant = 'default',
    size = 'md',
    multiline = false,
    floated,
}) => (
    <label
        htmlFor={htmlFor}
        className={
            variant === 'outlined' ? outlinedLabelClass(invalid, multiline, floated) : topLabelClass(size)
        }
    >
        {children}
        {required && (
            <span aria-hidden className={requiredMarkClass}>
                *
            </span>
        )}
    </label>
);

/* -------------------------------- FormField -------------------------------- */

type FormFieldProps = {
    id: string;
    label: string;
    required?: boolean;
    variant?: FieldVariant;
    size?: FieldSize;
    /** outlined + select/date only: whether the label is floated. Leave out for inputs/textareas. */
    floated?: boolean;
    /** outlined + textarea: label rests at the top */
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
    variant = 'default',
    size = 'md',
    floated,
    multiline,
    error,
    hint,
    className,
    children,
}) => {
    const reduce = useReducedMotion();
    const isOutlined = variant === 'outlined';

    const labelNode = (
        <FloatingLabel
            htmlFor={id}
            required={required}
            invalid={Boolean(error)}
            variant={variant}
            size={size}
            floated={floated}
            multiline={multiline}
        >
            {label}
        </FloatingLabel>
    );

    return (
        <div className={cn('group/field w-full', className)}>
            {/* default + filled: label above the control */}
            {!isOutlined && labelNode}

            <div className="relative">
                {/* The control must come BEFORE the label so the `peer` selectors work */}
                {children}
                {/* outlined: label floats from inside the control onto its top border */}
                {isOutlined && labelNode}
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
                        <FiAlertCircle aria-hidden className="size-3.5 shrink-0" />
                        <span>{error}</span>
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
