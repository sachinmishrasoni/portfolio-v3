'use client';

import React, { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import FormField, { describedBy } from './FormField';
import { iconPaddingClass, inputClass } from './form.styles';
import type { FieldSize } from './form.types';
import type { ColorFieldProps } from './form.types';

/* --------------------------------- helpers --------------------------------- */

/** The native picker only accepts "#rrggbb", so turn "#abc" into "#aabbcc". Returns undefined if invalid. */
const toHex6 = (value: string): string | undefined => {
    if (/^#[0-9a-f]{6}$/i.test(value)) return value;
    const short = /^#([0-9a-f]{3})$/i.exec(value);
    if (short) return `#${short[1].split('').map((c) => c + c).join('')}`;
    return undefined;
};

// Written out in full so Tailwind can see every class
const swatchSize: Record<FieldSize, string> = {
    sm: 'right-1.5 size-5',
    md: 'right-2 size-6',
    lg: 'right-2.5 size-7',
};

/* ---------------------------------- field ---------------------------------- */

/**
 * Hex color input with a color swatch inside it on the right.
 * Typing a hex updates the swatch; clicking the swatch opens the native color picker.
 *
 * variant: 'default' | 'outlined' | 'filled'    size: 'sm' | 'md' (default) | 'lg'
 */
const ColorField = forwardRef<HTMLInputElement, ColorFieldProps>(function ColorField(
    {
        id, name, label, placeholder, value, onChange, onBlur, required, disabled,
        error, hint, className, autoFocus,
        variant = 'default',
        size = 'md',
    },
    ref,
) {
    const invalid = Boolean(error);
    const hex = toHex6(value);

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const next = event.target.value.trim();
        // Add the # for the user, so typing "ff0000" works
        onChange(next && !next.startsWith('#') ? `#${next}` : next);
    };

    return (
        <FormField
            id={id}
            label={label}
            required={required}
            variant={variant}
            size={size}
            error={error}
            hint={hint}
            className={className}
        >
            <Input
                ref={ref}
                id={id}
                name={name}
                type="text"
                autoComplete="off"
                spellCheck={false}
                autoFocus={autoFocus}
                maxLength={7}
                // The outlined label needs a placeholder to detect "empty"; a single space does that
                placeholder={placeholder ?? ' '}
                value={value}
                onChange={handleTextChange}
                onBlur={onBlur}
                required={required}
                disabled={disabled}
                aria-invalid={invalid}
                aria-describedby={describedBy(id, error, hint)}
                className={inputClass(invalid, cn('uppercase', iconPaddingClass[size]), variant, size)}
            />

            {/* The swatch: a colored box with the native picker laid invisibly on top of it */}
            <span
                className={cn(
                    'absolute top-1/2 -translate-y-1/2 overflow-hidden rounded-md border border-border shadow-sm',
                    hex ? '' : 'bg-muted',
                    disabled && 'opacity-60',
                    swatchSize[size],
                )}
                style={hex ? { backgroundColor: hex } : undefined}
            >
                <input
                    type="color"
                    aria-label={`${label} color picker`}
                    value={hex ?? '#000000'}
                    onChange={(event) => onChange(event.target.value)}
                    onBlur={onBlur}
                    disabled={disabled}
                    className="absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                />
            </span>
        </FormField>
    );
});

export default ColorField;