import { cn } from '@/lib/utils';

/**
 * All the look of the form fields lives here, so changing it once changes every field.
 * Colours are theme tokens, so everything follows light and dark mode.
 *
 * Note: shadcn's own classes are overridden with the SAME variants they use (`focus-visible:`,
 * `dark:`, `data-[size=default]:`), because tailwind-merge only replaces a class that has the same variant.
 */

/* ------------------------------ the control ------------------------------- */

const controlBase =
    'w-full rounded-xl border bg-background/60 px-4 font-mono text-base text-foreground shadow-none ' +
    'transition-[border-color,box-shadow] duration-200 md:text-sm dark:bg-background/60 ' +
    'focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-70';

const controlOk =
    'border-border focus-visible:border-primary/60 focus-visible:ring-primary/15';
const controlBad =
    'border-destructive/70 focus-visible:border-destructive focus-visible:ring-destructive/15';

/** Shared by every field */
export const controlClass = (invalid: boolean, className?: string) =>
    cn(controlBase, invalid ? controlBad : controlOk, className);

/** <input>: the label floats using CSS only, from the `peer` state of this input */
export const inputClass = (invalid: boolean, className?: string) =>
    controlClass(
        invalid,
        cn(
            'peer h-12 pt-4 placeholder:text-transparent focus:placeholder:text-muted-foreground/70',
            className,
        ),
    );

/** <textarea> */
export const textareaClass = (invalid: boolean, className?: string) =>
    controlClass(
        invalid,
        cn(
            'peer min-h-32 resize-none pb-7 pt-7 placeholder:text-transparent focus:placeholder:text-muted-foreground/70',
            className,
        ),
    );

/** The button that opens a select list or a calendar */
export const triggerClass = (invalid: boolean, open: boolean, className?: string) =>
    controlClass(
        invalid,
        cn(
            // h-12 is repeated with shadcn's data-[size] variants so it beats `data-[size=default]:h-9`
            'flex h-12 items-center justify-between gap-2 pb-1 pt-4 text-left font-normal data-[size=default]:h-12 data-[size=sm]:h-12 dark:hover:bg-background/60',
            open &&
                (invalid
                    ? 'border-destructive ring-4 ring-destructive/15'
                    : 'border-primary/60 ring-4 ring-primary/15'),
            className,
        ),
    );

/* -------------------------------- the label ------------------------------- */

const labelBase =
    'pointer-events-none absolute left-4 z-10 max-w-[calc(100%-2rem)] truncate font-mono text-sm text-muted-foreground transition-all duration-200';

const floatedLook = 'top-2 translate-y-0 text-[10px] uppercase tracking-wider';

const labelRest = (multiline: boolean) => (multiline ? 'top-3.5' : 'top-1/2 -translate-y-1/2');

/**
 * Label for inputs and textareas: floats when the control is focused or has text.
 * The control must come BEFORE the label and have the `peer` class (inputClass / textareaClass do).
 */
export const peerLabelClass = (invalid: boolean, multiline = false) =>
    cn(
        labelBase,
        labelRest(multiline),
        'peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-wider',
        'peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-wider',
        // Browser autofill fills the value without `:placeholder-shown` changing, so float for it too
        'peer-[:-webkit-autofill]:top-2 peer-[:-webkit-autofill]:translate-y-0 peer-[:-webkit-autofill]:text-[10px] peer-[:-webkit-autofill]:uppercase peer-[:-webkit-autofill]:tracking-wider',
        invalid
            ? 'peer-focus:text-destructive peer-[:not(:placeholder-shown)]:text-destructive'
            : 'peer-focus:text-primary peer-[:not(:placeholder-shown)]:text-primary',
    );

/** Label for selects and dates: they have no placeholder state, so the field says when to float */
export const stateLabelClass = (floated: boolean, invalid: boolean) =>
    cn(
        labelBase,
        labelRest(false),
        floated && floatedLook,
        floated && (invalid ? 'text-destructive' : 'text-primary'),
    );

/* ------------------------------ small pieces ------------------------------ */

export const messageClass = 'mt-1.5 px-1 text-xs';
export const errorClass = cn(messageClass, 'text-destructive');
export const hintClass = cn(messageClass, 'text-muted-foreground');

/** The little icon button inside a field (password eye) */
export const fieldIconButtonClass =
    'absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-60';
