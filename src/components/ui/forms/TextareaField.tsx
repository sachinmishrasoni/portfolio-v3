'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import FormField, { describedBy } from './FormField';
import { Textarea } from '../textarea';
import { textareaClass } from './form.styles';
import type { TextareaFieldProps } from './form.types';

/**
 * variant:
 *  - 'default'  (default): label above a bordered field
 *  - 'outlined':           label rests inside the field, floats onto the top border when focused / filled
 *  - 'filled':             label above a tinted field
 *
 * size: 'sm' | 'md' (default) | 'lg'. It sets the text size, padding and minimum height.
 */
const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(function TextareaField(
    {
        id, name, label, placeholder, value, onChange, onBlur, required, disabled,
        error, hint, className, rows = 4, maxLength, showCount = false,
        variant = 'default',
        size = 'md',
    },
    ref,
) {
    const invalid = Boolean(error);
    const counterVisible = Boolean(showCount && maxLength);

    return (
        <FormField
            id={id}
            label={label}
            required={required}
            variant={variant}
            size={size}
            multiline
            error={error}
            hint={hint}
            className={className}
        >
            <Textarea
                ref={ref}
                id={id}
                name={name}
                rows={rows}
                maxLength={maxLength}
                // The outlined label needs a placeholder to detect "empty"; a single space does that
                placeholder={placeholder ?? ' '}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                required={required}
                disabled={disabled}
                aria-invalid={invalid}
                aria-describedby={describedBy(id, error, hint)}
                // Extra bottom padding so the text never runs under the counter
                className={textareaClass(invalid, cn(counterVisible && 'pb-6'), variant, size)}
            />

            {counterVisible ? (
                <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-1.5 right-3 font-mono text-[10px] text-muted-foreground"
                >
                    {value.length}/{maxLength}
                </span>
            ) : null}
        </FormField>
    );
});

export default TextareaField;
