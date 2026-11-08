'use client';

import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import FormField, { describedBy, FloatingLabel } from './FormField';
import { triggerClass } from './form.styles';
import type { SelectFieldProps } from './form.types';

/**
 * Dropdown built on the shadcn Select, with a floating label.
 *
 * The selected text is rendered here, not with shadcn's <SelectValue>, so it shows the option's
 * label (not its raw value) whichever shadcn flavour (Radix or Base UI) your select.tsx is.
 */
const SelectField: React.FC<SelectFieldProps> = ({
    id,
    name,
    label,
    placeholder,
    options,
    value,
    onChange,
    onBlur,
    required,
    disabled,
    error,
    hint,
    className,
}) => {
    const [open, setOpen] = useState(false);
    const invalid = Boolean(error);

    const selected = options.find((option) => option.value === value);
    // The label floats when something is chosen or the list is open
    const floated = Boolean(selected) || open;

    return (
        <FormField id={id} error={error} hint={hint} className={className}>
            <Select
                name={name}
                value={value}
                onValueChange={(next: string | null) => onChange(next ?? '')}
                open={open}
                onOpenChange={setOpen}
                required={required}
                disabled={disabled}
            >
                <SelectTrigger
                    id={id}
                    // Opening the list moves focus into it, which isn't a real blur; only report it once closed
                    onBlur={(event) => {
                        if (!open) onBlur?.(event);
                    }}
                    aria-invalid={invalid}
                    aria-required={required}
                    aria-describedby={describedBy(id, error, hint)}
                    className={triggerClass(invalid, open)}
                >
                    <span
                        className={cn(
                            'block min-w-0 truncate',
                            !selected && 'text-muted-foreground/70',
                        )}
                    >
                        {selected ? selected.label : open ? (placeholder ?? '') : ''}
                    </span>
                </SelectTrigger>

                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <FloatingLabel htmlFor={id} required={required} invalid={invalid} floated={floated}>
                {label}
            </FloatingLabel>
        </FormField>
    );
};

export default SelectField;
