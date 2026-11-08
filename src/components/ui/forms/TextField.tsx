'use client';

import React, { forwardRef, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import FormField, { describedBy } from './FormField';
import { fieldIconButtonClass, inputClass } from './form.styles';
import type { TextFieldProps } from './form.types';

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
    {
        id, name, label, placeholder, value, onChange, onBlur, required, disabled,
        error, hint, className, type = 'text', autoComplete, autoFocus, maxLength,
        variant = 'floating',
    },
    ref,
) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const invalid = Boolean(error);

    return (
        <FormField
            id={id}
            label={label}
            required={required}
            variant={variant}
            error={error}
            hint={hint}
            className={className}
        >
            <Input
                ref={ref}
                id={id}
                name={name}
                type={isPassword && showPassword ? 'text' : type}
                inputMode={type === 'email' ? 'email' : undefined}
                autoComplete={autoComplete}
                autoFocus={autoFocus}
                maxLength={maxLength}
                // The label needs a placeholder to detect "empty"; a single space does that
                placeholder={placeholder ?? ' '}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                required={required}
                disabled={disabled}
                aria-invalid={invalid}
                aria-describedby={describedBy(id, error, hint)}
                className={inputClass(invalid, cn(isPassword && 'pr-12'), variant)}
            />

            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={disabled}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    className={fieldIconButtonClass}
                >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
            )}
        </FormField>
    );
});

export default TextField;
