'use client';

import React, { useState } from 'react';
import { FiCalendar } from 'react-icons/fi';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import FormField, { describedBy } from './FormField';
import { triggerClass, triggerTextClass } from './form.styles';
import type { DateFieldProps, FieldSize } from './form.types';

/* --------------------------------- helpers --------------------------------- */
// Values are plain "yyyy-MM-dd" strings, built from LOCAL date parts. Going through
// toISOString() would convert to UTC and can shift the date by a day.

const parseDate = (value: string | undefined): Date | undefined => {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return Number.isNaN(date.getTime()) ? undefined : date;
};

const formatValue = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
        date.getDate(),
    ).padStart(2, '0')}`;

// A fixed locale, so the server and the browser always print the same text
const displayFormat = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
});

// Calendar icon scales with the field size
const iconSize: Record<FieldSize, string> = {
    sm: 'size-3.5',
    md: 'size-4',
    lg: 'size-[18px]',
};

/* ---------------------------------- field ---------------------------------- */

/**
 * Date picker built on the shadcn Popover + Calendar.
 *
 * variant:
 *  - 'default'  (default): label above a bordered field, placeholder always visible
 *  - 'outlined':           label rests inside the field, floats onto the top border when open / filled
 *  - 'filled':             label above a tinted field, placeholder always visible
 *
 * size: 'sm' (32px) | 'md' (40px, default) | 'lg' (48px)
 */
const DateField: React.FC<DateFieldProps> = ({
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
    minDate,
    maxDate,
    variant = 'default',
    size = 'md',
}) => {
    const [open, setOpen] = useState(false);
    const invalid = Boolean(error);

    const date = parseDate(value);
    // Only the outlined label moves; default and filled labels stay above the field
    const floated = Boolean(date) || open;
    // With the label above the field the placeholder can always be shown.
    // With the outlined label resting inside, show it only once the label has floated.
    const showPlaceholder = variant !== 'outlined' || open;

    const min = parseDate(minDate);
    const max = parseDate(maxDate);
    const unavailable = [
        ...(min ? [{ before: min }] : []),
        ...(max ? [{ after: max }] : []),
    ];

    const handleSelect = (day: Date | undefined) => {
        if (day) {
            onChange(formatValue(day));
            setOpen(false);
        } else if (!required) {
            // Clicking the selected day again clears it (unless a date is required)
            onChange('');
            setOpen(false);
        }
    };

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
            {/* So the date is submitted with a normal <form> */}
            <input type="hidden" name={name} value={value} />

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                    id={id}
                    type="button"
                    disabled={disabled}
                    onBlur={(event: React.FocusEvent<HTMLButtonElement>) => {
                        if (!open) onBlur?.(event);
                    }}
                    aria-invalid={invalid}
                    aria-required={required}
                    aria-describedby={describedBy(id, error, hint)}
                    className={triggerClass(invalid, open, undefined, variant, size)}
                >
                    <span className={cn(triggerTextClass(), !date && 'text-muted-foreground/70')}>
                        {date
                            ? displayFormat.format(date)
                            : showPlaceholder
                                ? (placeholder ?? '')
                                : ''}
                    </span>
                    <FiCalendar
                        aria-hidden
                        className={cn('shrink-0 text-muted-foreground', iconSize[size])}
                    />
                </PopoverTrigger>

                <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleSelect}
                        defaultMonth={date ?? min ?? max}
                        disabled={unavailable.length ? unavailable : undefined}
                    />
                </PopoverContent>
            </Popover>
        </FormField>
    );
};

export default DateField;
