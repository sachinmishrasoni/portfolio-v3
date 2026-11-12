import { cn } from '@/lib/utils';
import type { FieldSize, FieldVariant } from './form.types';

/* ------------------------------ the control ------------------------------- */

const controlBase =
    'w-full rounded-lg border font-mono text-foreground shadow-none ' +
    'transition-[border-color,background-color,box-shadow] duration-200 ' +
    'placeholder:text-muted-foreground/70 ' +
    'focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed';

// Colours per variant (normal state)
const variantOk: Record<FieldVariant, string> = {
    default: 'border-border bg-background focus-visible:border-primary',
    outlined: 'border-input bg-background focus-visible:border-primary',
    filled:
        'border-transparent bg-primary/5 hover:bg-primary/10 ' +
        'focus-visible:border-primary focus-visible:bg-primary/10',
};

// Colours per variant (error state)
const variantBad: Record<FieldVariant, string> = {
    default: 'border-destructive/70 bg-background focus-visible:border-destructive',
    outlined: 'border-destructive/70 bg-background focus-visible:border-destructive',
    filled:
        'border-destructive/40 bg-destructive/10 hover:bg-destructive/10 ' +
        'focus-visible:border-destructive focus-visible:bg-destructive/10',
};

// Colours per variant (disabled state)
// outlined keeps `bg-background` so the label on the border blends in
const variantDisabled: Record<FieldVariant, string> = {
    default: 'disabled:bg-muted/60 disabled:opacity-70',
    outlined: 'disabled:bg-background disabled:opacity-60',
    filled: 'disabled:bg-muted disabled:opacity-70 disabled:hover:bg-muted',
};

export const controlClass = (
    invalid: boolean,
    variant: FieldVariant = 'default',
    className?: string,
) =>
    cn(
        controlBase,
        invalid ? variantBad[variant] : variantOk[variant],
        variantDisabled[variant],
        className,
    );

/* --------------------------------- sizes ---------------------------------- */
// Heights: sm 32px · md 40px · lg 48px
// Text is 16px on small screens (stops iOS zooming into inputs), then the size's own text from `md:` up.

const sizeHeight: Record<FieldSize, string> = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
};

const sizeText: Record<FieldSize, string> = {
    sm: 'px-3 text-base md:text-xs',
    md: 'px-3.5 text-base md:text-sm',
    lg: 'px-4 text-base md:text-base',
};

// Written out in full so Tailwind can see every class
const sizeTrigger: Record<FieldSize, string> = {
    sm: 'h-8 py-0 data-[size=default]:h-8 data-[size=sm]:h-8',
    md: 'h-10 py-0 data-[size=default]:h-10 data-[size=sm]:h-10',
    lg: 'h-12 py-0 data-[size=default]:h-12 data-[size=sm]:h-12',
};

const sizeTextarea: Record<FieldSize, string> = {
    sm: 'min-h-20 py-1.5',
    md: 'min-h-28 py-2',
    lg: 'min-h-32 py-3',
};

/** Right padding that makes room for the icon button (password eye, etc.) */
export const iconPaddingClass: Record<FieldSize, string> = {
    sm: 'pr-9',
    md: 'pr-10',
    lg: 'pr-12',
};

/** Hides the up/down arrows on type="number" */
export const numberNoSpinnerClass =
    '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none';

// outlined has a floating label that rests inside the field, so the placeholder
// stays hidden until the field is focused (otherwise it would overlap the label)
const outlinedPlaceholder = 'placeholder:text-transparent focus:placeholder:text-muted-foreground/70';

export const inputClass = (
    invalid: boolean,
    className?: string,
    variant: FieldVariant = 'default',
    size: FieldSize = 'md',
) =>
    controlClass(
        invalid,
        variant,
        cn('peer', sizeHeight[size], sizeText[size], variant === 'outlined' && outlinedPlaceholder, className),
    );

export const textareaClass = (
    invalid: boolean,
    className?: string,
    variant: FieldVariant = 'default',
    size: FieldSize = 'md',
) =>
    controlClass(
        invalid,
        variant,
        cn(
            'peer resize-none',
            sizeText[size],
            sizeTextarea[size],
            variant === 'outlined' && outlinedPlaceholder,
            className,
        ),
    );

/** For the shadcn Select / date trigger button */
export const triggerClass = (
    invalid: boolean,
    open: boolean,
    className?: string,
    variant: FieldVariant = 'default',
    size: FieldSize = 'md',
) =>
    controlClass(
        invalid,
        variant,
        cn(
            'flex items-center justify-between gap-2 text-left font-normal dark:hover:bg-transparent',
            sizeText[size],
            sizeTrigger[size],
            open &&
            (invalid
                ? 'border-destructive'
                : 'border-primary'),
            className,
        ),
    );

/** Value text inside a select / date trigger */
export const triggerTextClass = () => 'block min-w-0 truncate';

/* -------------------------------- the label ------------------------------- */

const labelSize: Record<FieldSize, string> = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-sm',
};

/** Label for `default` and `filled`: a normal label above the control */
export const topLabelClass = (size: FieldSize = 'md') =>
    cn('mb-1.5 block font-mono font-medium text-foreground', labelSize[size]);

/**
 * Label for `outlined`: rests inside the field, then floats up onto the top border
 * (with a solid bg that "cuts" the border line) when focused or filled.
 * Change `bg-background` if your fields sit on a card with a different background.
 *
 * - inputs/textareas: leave `floated` undefined, the control's `peer` state drives it
 * - selects/dates: pass `floated` true/false
 */
export const outlinedLabelClass = (invalid: boolean, multiline = false, floated?: boolean) => {
    const base = cn(
        'pointer-events-none absolute left-2.5 z-10 max-w-[calc(100%-1.5rem)] truncate px-1.5 font-mono',
        'transition-all duration-200',
        invalid ? 'text-destructive' : 'text-muted-foreground group-focus-within/field:text-primary',
    );
    const rest = multiline ? 'top-3 translate-y-0 text-sm' : 'top-1/2 -translate-y-1/2 text-sm';

    if (floated !== undefined) {
        return cn(base, floated ? 'top-0 -translate-y-1/2 bg-background text-xs' : rest);
    }

    return cn(
        base,
        rest,
        'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:bg-background peer-focus:text-xs',
        'peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:bg-background peer-[:not(:placeholder-shown)]:text-xs',
        // Browser autofill fills the value without `:placeholder-shown` changing
        'peer-[:-webkit-autofill]:top-0 peer-[:-webkit-autofill]:-translate-y-1/2 peer-[:-webkit-autofill]:bg-background peer-[:-webkit-autofill]:text-xs',
    );
};

export const requiredMarkClass = 'ml-0.5 text-destructive';

/* ------------------------------ small pieces ------------------------------ */

export const messageClass = 'mt-1.5 px-0.5 text-xs';
export const errorClass = cn(messageClass, 'flex items-center gap-1.5 text-destructive');
export const hintClass = cn(messageClass, 'text-muted-foreground');

const iconButtonSize: Record<FieldSize, string> = {
    sm: 'right-1.5 size-6 text-sm',
    md: 'right-1.5 size-7 text-base',
    lg: 'right-2 size-8 text-base',
};

export const fieldIconButtonClass = (size: FieldSize = 'md') =>
    cn(
        'absolute top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors',
        'hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary',
        'disabled:pointer-events-none disabled:opacity-60',
        iconButtonSize[size],
    );
