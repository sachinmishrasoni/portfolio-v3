import { cn } from '@/lib/utils';
import type { FieldVariant } from './form.types';

/* ------------------------------ the control ------------------------------- */

const controlBase =
    'w-full rounded-xl border bg-background/60 px-4 font-mono text-base text-foreground shadow-none ' +
    'transition-[border-color,box-shadow] duration-200 md:text-sm dark:bg-background/60 ' +
    'focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-70';

const controlOk = 'border-border focus-visible:border-primary/60 focus-visible:ring-primary/15';
const controlBad =
    'border-destructive/70 focus-visible:border-destructive focus-visible:ring-destructive/15';

export const controlClass = (invalid: boolean, className?: string) =>
    cn(controlBase, invalid ? controlBad : controlOk, className);

const hiddenPlaceholder =
    'placeholder:text-transparent focus:placeholder:text-muted-foreground/70';
const shownPlaceholder = 'placeholder:text-muted-foreground/70';

const inputByVariant: Record<FieldVariant, string> = {
    floating: cn('peer h-12 pt-4', hiddenPlaceholder),
    border: cn('peer h-12', hiddenPlaceholder),
    top: cn('peer h-11', shownPlaceholder),
};

export const inputClass = (invalid: boolean, className?: string, variant: FieldVariant = 'floating') =>
    controlClass(invalid, cn(inputByVariant[variant], className));

const textareaByVariant: Record<FieldVariant, string> = {
    floating: cn('peer min-h-32 resize-none pb-7 pt-7', hiddenPlaceholder),
    border: cn('peer min-h-32 resize-none pb-7 pt-3.5', hiddenPlaceholder),
    top: cn('peer min-h-32 resize-none pb-7 pt-3', shownPlaceholder),
};

export const textareaClass = (invalid: boolean, className?: string, variant: FieldVariant = 'floating') =>
    controlClass(invalid, cn(textareaByVariant[variant], className));

// const triggerByVariant: Record<FieldVariant, string> = {
//     // h-* is repeated with shadcn's data-[size] variants so it beats `data-[size=default]:h-9`
//     floating: 'h-12 pb-1 pt-4 data-[size=default]:h-12 data-[size=sm]:h-12',
//     border: 'h-12 py-0 data-[size=default]:h-12 data-[size=sm]:h-12',
//     top: 'h-11 py-0 data-[size=default]:h-11 data-[size=sm]:h-11',
// };

const triggerByVariant: Record<FieldVariant, string> = {
    // h-* is repeated with shadcn's data-[size] variants so it beats `data-[size=default]:h-9`
    floating: 'h-12 py-0 data-[size=default]:h-12 data-[size=sm]:h-12',
    border: 'h-12 py-0 data-[size=default]:h-12 data-[size=sm]:h-12',
    top: 'h-11 py-0 data-[size=default]:h-11 data-[size=sm]:h-11',
};

/** Pushes the value text below the floated label (floating variant only), without moving the icon */
export const triggerTextClass = (variant: FieldVariant = 'floating') =>
    cn('block min-w-0 truncate', variant === 'floating' && 'pt-3');

export const triggerClass = (
    invalid: boolean,
    open: boolean,
    className?: string,
    variant: FieldVariant = 'floating',
) =>
    controlClass(
        invalid,
        cn(
            'flex items-center justify-between gap-2 text-left font-normal dark:hover:bg-background/60',
            triggerByVariant[variant],
            open &&
            (invalid
                ? 'border-destructive ring-4 ring-destructive/15'
                : 'border-primary/60 ring-4 ring-primary/15'),
            className,
        ),
    );

/* -------------------------------- the label ------------------------------- */

const labelBase =
    'pointer-events-none absolute z-10 max-w-[calc(100%-2rem)] truncate font-mono text-sm text-muted-foreground transition-all duration-200';

// Positions per variant. Written out in full so Tailwind can see every class.
const leftFloating = 'left-4';
const leftBorder = 'left-2.5 px-1.5'; // 10px + 6px padding = text lines up with the input text (16px)

const floatedInside = 'top-2 translate-y-0 text-[10px] uppercase tracking-wider';
// On the border: centred on the top edge, with a solid bg that "cuts" the border line.
// Change `bg-background` here if your fields sit on a card with a different background.
const floatedOnBorder =
    'top-0 -translate-y-1/2 bg-background text-[10px] uppercase tracking-wider';

const labelRest = (multiline: boolean) => (multiline ? 'top-3.5' : 'top-1/2 -translate-y-1/2');

/** Label for inputs/textareas (floating + border): driven by the control's `peer` state. */
export const peerLabelClass = (
    invalid: boolean,
    multiline = false,
    variant: FieldVariant = 'floating',
) => {
    const color = invalid
        ? 'peer-focus:text-destructive peer-[:not(:placeholder-shown)]:text-destructive'
        : 'peer-focus:text-primary peer-[:not(:placeholder-shown)]:text-primary';

    if (variant === 'border') {
        return cn(
            labelBase,
            leftBorder,
            labelRest(multiline),
            'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:bg-background peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-wider',
            'peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:bg-background peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-wider',
            'peer-[:-webkit-autofill]:top-0 peer-[:-webkit-autofill]:-translate-y-1/2 peer-[:-webkit-autofill]:bg-background peer-[:-webkit-autofill]:text-[10px] peer-[:-webkit-autofill]:uppercase peer-[:-webkit-autofill]:tracking-wider',
            color,
        );
    }

    return cn(
        labelBase,
        leftFloating,
        labelRest(multiline),
        'peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-wider',
        'peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-wider',
        // Browser autofill fills the value without `:placeholder-shown` changing, so float for it too
        'peer-[:-webkit-autofill]:top-2 peer-[:-webkit-autofill]:translate-y-0 peer-[:-webkit-autofill]:text-[10px] peer-[:-webkit-autofill]:uppercase peer-[:-webkit-autofill]:tracking-wider',
        color,
    );
};

/** Label for selects and dates: the field says when to float */
export const stateLabelClass = (
    floated: boolean,
    invalid: boolean,
    variant: FieldVariant = 'floating',
) => {
    const border = variant === 'border';
    return cn(
        labelBase,
        border ? leftBorder : leftFloating,
        labelRest(false),
        floated && (border ? floatedOnBorder : floatedInside),
        floated && (invalid ? 'text-destructive' : 'text-primary'),
    );
};

/** Label for the `top` variant: a normal label above the control */
export const topLabelClass = (invalid: boolean) =>
    cn(
        'mb-1.5 block px-1 font-mono text-xs uppercase tracking-wider transition-colors',
        invalid
            ? 'text-destructive'
            : 'text-muted-foreground group-focus-within/field:text-primary',
    );

/* ------------------------------ small pieces ------------------------------ */

export const messageClass = 'mt-1.5 px-1 text-xs';
export const errorClass = cn(messageClass, 'text-destructive');
export const hintClass = cn(messageClass, 'text-muted-foreground');

export const fieldIconButtonClass =
    'absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-60';