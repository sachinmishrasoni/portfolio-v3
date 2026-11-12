'use client';

import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import FormField, { describedBy } from './FormField';
import { triggerClass, triggerTextClass } from './form.styles';
import type { SelectFieldProps } from './form.types';

/**
 * variant:
 *  - 'default'  (default): label above a bordered field, placeholder always visible
 *  - 'outlined':           label rests inside the field, floats onto the top border when open / filled
 *  - 'filled':             label above a tinted field, placeholder always visible
 *
 * size: 'sm' (32px) | 'md' (40px, default) | 'lg' (48px)
 */
const SelectField: React.FC<SelectFieldProps> = ({
    id, name, label, placeholder, options, value, onChange, onBlur, required,
    disabled, error, hint, className, variant = 'default', size = 'md',
}) => {
    const [open, setOpen] = useState(false);
    const invalid = Boolean(error);

    const selected = options.find((option) => option.value === value);
    // Only the outlined label moves; default and filled labels stay above the field
    const floated = Boolean(selected) || open;
    // With the label above the field the placeholder can always be shown.
    // With the outlined label resting inside, show it only once the label has floated.
    const showPlaceholder = variant !== 'outlined' || open;

    return (
        <FormField
            id={id}
            label={label}
            required={required}
            variant={variant}
            size={size}
            floated={floated}
            error={error}
            hint={hint}
            className={className}
        >
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
                    onBlur={(event) => {
                        if (!open) onBlur?.(event);
                    }}
                    aria-invalid={invalid}
                    aria-required={required}
                    aria-describedby={describedBy(id, error, hint)}
                    className={triggerClass(invalid, open, undefined, variant, size)}
                >
                    <span className={cn(triggerTextClass(), !selected && 'text-muted-foreground/70')}>
                        {selected ? selected.label : showPlaceholder ? (placeholder ?? '') : ''}
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
        </FormField>
    );
};

export default SelectField;
