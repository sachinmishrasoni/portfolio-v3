'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiCheck, FiChevronDown, FiPlus, FiX } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import FormField, { describedBy } from './FormField';
import { multiSelectControlClass } from './form.styles';
import type { MultiSelectFieldProps } from './form.types';

type Item = { value: string; label: string; disabled?: boolean; create?: boolean };

/**
 * Multi-select with chips, a search box and (optionally) "add your own" values.
 * The list is rendered in place (not in a portal), so it works the same with Radix or Base UI.
 */
const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
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
    variant = 'default',
    size = 'md',
    searchable = true,
    creatable = false,
    maxSelected,
    emptyText = 'No options found',
    searchPlaceholder,
}) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(0);

    const rootRef = useRef<HTMLDivElement>(null);
    const controlRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const invalid = Boolean(error);
    const hasValue = value.length > 0;
    const listId = `${id}-listbox`;
    const atLimit = maxSelected !== undefined && value.length >= maxSelected;

    // Created values are not in `options`, so fall back to the value itself as the label
    const labelOf = (v: string) => options.find((option) => option.value === v)?.label ?? v;

    const items = useMemo<Item[]>(() => {
        const q = query.trim().toLowerCase();

        const list: Item[] = options
            .filter((option) => !q || option.label.toLowerCase().includes(q))
            .map((option) => ({
                ...option,
                disabled: option.disabled || (atLimit && !value.includes(option.value)),
            }));

        if (creatable && q) {
            const exists =
                options.some(
                    (option) => option.label.toLowerCase() === q || option.value.toLowerCase() === q,
                ) || value.some((v) => v.toLowerCase() === q);

            if (!exists && !atLimit) {
                list.push({ value: query.trim(), label: query.trim(), create: true });
            }
        }

        return list;
    }, [options, query, creatable, atLimit, value]);

    const safeActive = Math.min(active, Math.max(items.length - 1, 0));

    /* ------------------------------- behaviour ------------------------------ */

    const openList = () => {
        if (disabled) return;
        setActive(0);
        setOpen(true);
    };

    const closeList = (refocus = true) => {
        setOpen(false);
        setQuery('');
        if (refocus) controlRef.current?.focus();
    };

    const toggle = (item: Item) => {
        if (item.disabled) return;
        onChange(
            value.includes(item.value)
                ? value.filter((v) => v !== item.value)
                : [...value, item.value],
        );
        setQuery('');
    };

    // Focus leaving the whole field (control + list) closes it and reports the blur
    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        if (rootRef.current?.contains(event.relatedTarget as Node | null)) return;
        setOpen(false);
        setQuery('');
        onBlur?.();
    };

    // Move focus into the search box when the list opens
    useEffect(() => {
        if (open) searchRef.current?.focus();
    }, [open]);

    // Back to the first result when the search changes
    useEffect(() => {
        setActive(0);
    }, [query]);

    // Keep the highlighted option visible while using the arrow keys
    useEffect(() => {
        if (!open) return;
        listRef.current
            ?.querySelector<HTMLElement>('[data-active="true"]')
            ?.scrollIntoView({ block: 'nearest' });
    }, [safeActive, open]);

    const handleControlKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        // Ignore keys coming from the remove buttons inside the chips
        if (event.target !== event.currentTarget) return;
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
            event.preventDefault();
            openList();
        }
    };

    const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                if (items.length) setActive((safeActive + 1) % items.length);
                break;
            case 'ArrowUp':
                event.preventDefault();
                if (items.length) setActive((safeActive - 1 + items.length) % items.length);
                break;
            case 'Enter':
                // Also stops the surrounding <form> from submitting
                event.preventDefault();
                if (items[safeActive]) toggle(items[safeActive]);
                break;
            case ' ':
                if (!searchable) {
                    event.preventDefault();
                    if (items[safeActive]) toggle(items[safeActive]);
                }
                break;
            case 'Escape':
                event.preventDefault();
                closeList();
                break;
            case 'Backspace':
                if (!query && hasValue) onChange(value.slice(0, -1));
                break;
        }
    };

    // With the label on the border (outlined) the placeholder would overlap it, so show it only while open
    const showPlaceholder = open || variant !== 'outlined';

    const chipHeight = size === 'sm' ? 'h-5' : 'h-6';

    /* --------------------------------- render -------------------------------- */

    return (
        <FormField
            id={id}
            label={label}
            required={required}
            variant={variant}
            size={size}
            // Only the outlined label uses this: it moves onto the border when there are chips or the list is open
            floated={hasValue || open}
            error={error}
            hint={hint}
            className={className}
        >
            <div ref={rootRef} onBlur={handleBlur}>
                {/* So the values are submitted with a normal <form> (one entry per value) */}
                {value.map((v) => (
                    <input key={v} type="hidden" name={name} value={v} />
                ))}

                <div
                    ref={controlRef}
                    id={id}
                    role="combobox"
                    tabIndex={disabled ? -1 : 0}
                    aria-label={label}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-controls={listId}
                    aria-invalid={invalid}
                    aria-required={required}
                    aria-disabled={disabled}
                    aria-describedby={describedBy(id, error, hint)}
                    onClick={() => (open ? closeList() : openList())}
                    onKeyDown={handleControlKeyDown}
                    className={multiSelectControlClass(invalid, open, variant, size)}
                >
                    {hasValue ? (
                        value.map((v) => (
                            <span
                                key={v}
                                className={cn(
                                    'inline-flex max-w-full items-center gap-1 rounded-full bg-muted pl-2.5 pr-1 text-xs text-foreground',
                                    chipHeight,
                                )}
                            >
                                <span className="truncate">{labelOf(v)}</span>
                                <button
                                    type="button"
                                    disabled={disabled}
                                    aria-label={`Remove ${labelOf(v)}`}
                                    // Keeps focus where it is, so the field does not blur on click
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onChange(value.filter((x) => x !== v));
                                    }}
                                    className="flex size-4 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:pointer-events-none"
                                >
                                    <FiX aria-hidden className="size-3" />
                                </button>
                            </span>
                        ))
                    ) : showPlaceholder && placeholder ? (
                        <span className="truncate text-muted-foreground/70">{placeholder}</span>
                    ) : null}

                    <FiChevronDown
                        aria-hidden
                        className={cn(
                            'pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-transform duration-200',
                            open && 'rotate-180',
                        )}
                    />
                </div>

                {open && (
                    <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-md">
                        {/* Not searchable: the input stays (for the keyboard) but is hidden */}
                        <div className={cn('border-b border-border/70 px-3', !searchable && 'sr-only')}>
                            <input
                                ref={searchRef}
                                value={query}
                                readOnly={!searchable}
                                autoComplete="off"
                                placeholder={
                                    searchPlaceholder ??
                                    (creatable ? 'Search or type to add…' : 'Search…')
                                }
                                aria-label="Search options"
                                aria-controls={listId}
                                aria-activedescendant={
                                    items[safeActive] ? `${id}-opt-${safeActive}` : undefined
                                }
                                onChange={(event) => setQuery(event.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="h-10 w-full bg-transparent font-mono text-base outline-none placeholder:text-muted-foreground/70 md:text-sm"
                            />
                        </div>

                        <div
                            ref={listRef}
                            id={listId}
                            role="listbox"
                            aria-label={label}
                            aria-multiselectable="true"
                            // Keeps focus in the search box when clicking the list or its scrollbar
                            onMouseDown={(event) => event.preventDefault()}
                            className="max-h-60 overflow-y-auto p-1"
                        >
                            {items.length === 0 ? (
                                <p className="px-3 py-2 text-sm text-muted-foreground">{emptyText}</p>
                            ) : (
                                items.map((item, index) => {
                                    const selected = value.includes(item.value);
                                    return (
                                        <div
                                            key={`${item.create ? 'new' : 'opt'}-${item.value}`}
                                            id={`${id}-opt-${index}`}
                                            role="option"
                                            aria-selected={selected}
                                            aria-disabled={item.disabled}
                                            data-active={index === safeActive}
                                            onMouseEnter={() => setActive(index)}
                                            onClick={() => toggle(item)}
                                            className={cn(
                                                'flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 font-mono text-sm',
                                                index === safeActive && 'bg-muted',
                                                item.disabled && 'pointer-events-none opacity-50',
                                            )}
                                        >
                                            <span className="flex min-w-0 items-center gap-2">
                                                {item.create && (
                                                    <FiPlus aria-hidden className="size-4 shrink-0" />
                                                )}
                                                <span className="truncate">
                                                    {item.create ? `Add "${item.label}"` : item.label}
                                                </span>
                                            </span>
                                            {selected && (
                                                <FiCheck aria-hidden className="size-4 shrink-0 text-primary" />
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>
        </FormField>
    );
};

export default MultiSelectField;
