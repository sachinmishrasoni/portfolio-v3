'use client';

import React, { useState } from 'react';
import { FiCalendar } from 'react-icons/fi';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import FormField, { describedBy, FloatingLabel } from './FormField';
import { triggerClass } from './form.styles';
import type { DateFieldProps } from './form.types';

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

/* ---------------------------------- field ---------------------------------- */

/** Date picker built on the shadcn Popover + Calendar, with a floating label. */
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
}) => {
    const [open, setOpen] = useState(false);
    const invalid = Boolean(error);

    const date = parseDate(value);
    const floated = Boolean(date) || open;

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
        <FormField id={id} error={error} hint={hint} className={className}>
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
                    className={triggerClass(invalid, open)}
                >
                    <span
                        className={cn('block min-w-0 truncate', !date && 'text-muted-foreground/70')}
                    >
                        {date ? displayFormat.format(date) : open ? (placeholder ?? '') : ''}
                    </span>
                    <FiCalendar aria-hidden className="size-4 shrink-0 text-muted-foreground" />
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

            <FloatingLabel htmlFor={id} required={required} invalid={invalid} floated={floated}>
                {label}
            </FloatingLabel>
        </FormField>
    );
};

export default DateField;
