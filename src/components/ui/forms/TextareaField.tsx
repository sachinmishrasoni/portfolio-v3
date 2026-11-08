'use client';

import React, { forwardRef } from 'react';
import FormField, { describedBy, FloatingLabel } from './FormField';
import { textareaClass } from './form.styles';
import type { TextareaFieldProps } from './form.types';

/**
 * Multi-line text input with a floating label.
 * (There is no shadcn textarea in components/ui, so this is a native <textarea> with the same styling.)
 */
const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(function TextareaField(
    {
        id,
        name,
        label,
        placeholder,
        value,
        onChange,
        onBlur,
        required,
        disabled,
        error,
        hint,
        className,
        rows = 4,
        maxLength,
        showCount = false,
    },
    ref,
) {
    const invalid = Boolean(error);

    return (
        <FormField id={id} error={error} hint={hint} className={className}>
            <textarea
                ref={ref}
                id={id}
                name={name}
                rows={rows}
                maxLength={maxLength}
                placeholder={placeholder ?? ' '}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                required={required}
                disabled={disabled}
                aria-invalid={invalid}
                aria-describedby={describedBy(id, error, hint)}
                className={textareaClass(invalid)}
            />

            <FloatingLabel htmlFor={id} required={required} invalid={invalid} multiline>
                {label}
            </FloatingLabel>

            {showCount && maxLength ? (
                <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-2 right-4 font-mono text-[10px] text-muted-foreground"
                >
                    {value.length}/{maxLength}
                </span>
            ) : null}
        </FormField>
    );
});

export default TextareaField;
