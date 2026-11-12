'use client';

import React, { forwardRef, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import FormField, { describedBy } from './FormField';
import {
    fieldIconButtonClass,
    iconPaddingClass,
    inputClass,
    numberNoSpinnerClass,
} from './form.styles';
import type { TextFieldProps } from './form.types';

const inputModeByType = {
    text: undefined,
    email: 'email',
    password: undefined,
    number: 'decimal',
} as const;

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
    {
        id, name, label, placeholder, value, onChange, onBlur, required, disabled,
        error, hint, className, type = 'text', autoComplete, autoFocus, maxLength,
        min, max, step,
        variant = 'default',
        size = 'md',
    },
    ref,
) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const isNumber = type === 'number';
    const invalid = Boolean(error);

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
                type={isPassword && showPassword ? 'text' : type}
                inputMode={inputModeByType[type]}
                autoComplete={autoComplete}
                autoFocus={autoFocus}
                maxLength={maxLength}
                min={isNumber ? min : undefined}
                max={isNumber ? max : undefined}
                step={isNumber ? step : undefined}
                // The outlined label needs a placeholder to detect "empty"; a single space does that
                placeholder={placeholder ?? ' '}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                // Stops the mouse wheel from silently changing a focused number field
                onWheel={isNumber ? (e) => e.currentTarget.blur() : undefined}
                required={required}
                disabled={disabled}
                aria-invalid={invalid}
                aria-describedby={describedBy(id, error, hint)}
                className={inputClass(
                    invalid,
                    cn(isPassword && iconPaddingClass[size], isNumber && numberNoSpinnerClass),
                    variant,
                    size,
                )}
            />

            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={disabled}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    className={fieldIconButtonClass(size)}
                >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
            )}
        </FormField>
    );
});

export default TextField;
