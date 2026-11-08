'use client';

import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import FormField, { describedBy } from './FormField';
import { triggerClass, triggerTextClass } from './form.styles';
import type { SelectFieldProps } from './form.types';

const SelectField: React.FC<SelectFieldProps> = ({
    id, name, label, placeholder, options, value, onChange, onBlur, required,
    disabled, error, hint, className, variant = 'floating',
}) => {
    const [open, setOpen] = useState(false);
    const invalid = Boolean(error);

    const selected = options.find((option) => option.value === value);
    const floated = Boolean(selected) || open;
    // With the label above the field, the placeholder can always be shown
    const showPlaceholder = open || variant === 'top';

    return (
        <FormField
            id={id}
            label={label}
            required={required}
            variant={variant}
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
                    className={triggerClass(invalid, open, undefined, variant)}
                >
                    {/* <span
                        className={cn(
                            'block min-w-0 truncate',
                            !selected && 'text-muted-foreground/70',
                        )}
                    >
                        {selected ? selected.label : showPlaceholder ? (placeholder ?? '') : ''}
                    </span> */}
                    <span className={cn(triggerTextClass(variant), !selected && 'text-muted-foreground/70')}>
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
