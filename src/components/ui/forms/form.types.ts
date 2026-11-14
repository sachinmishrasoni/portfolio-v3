import type { ChangeEventHandler, FocusEventHandler } from 'react';

/**
 * default:  label sits above a bordered field
 * outlined: label sits on the top border (cuts the border line)
 * filled:   label sits above a tinted, filled field
 */
export type FieldVariant = 'default' | 'outlined' | 'filled';

/** sm = 32px, md = 40px, lg = 48px tall */
export type FieldSize = 'sm' | 'md' | 'lg';

/** Props that every field in this folder accepts */
export type FieldBaseProps = {
    /** Used for the control's `id`, and ties the label, error and hint to it */
    id: string;
    /** The field's `name`, so it is submitted with the form */
    name: string;
    /** The field's label */
    label: string;
    /** Placeholder shown inside the empty field, e.g. "Enter your username" */
    placeholder?: string;
    /** Adds * to the label and `required` / `aria-required` to the control */
    required?: boolean;
    disabled?: boolean;
    /** Error message. Shows under the field and turns it red. */
    error?: string;
    /** Helper text under the field (replaced by the error while there is one) */
    hint?: string;
    /** Classes for the outer wrapper, e.g. "sm:col-span-2" */
    className?: string;
    /** Visual style of the field (default: 'default') */
    variant?: FieldVariant;
    /** Height / text size of the field (default: 'md') */
    size?: FieldSize;
};

/* ------------------------------- TextField -------------------------------- */

export type TextFieldType = 'text' | 'email' | 'password' | 'number';

export type TextFieldProps = FieldBaseProps & {
    type?: TextFieldType;
    /** Keep it a string, even for type="number" (works with `formik.handleChange`) */
    value: string;
    /** A normal change event, so it works with `formik.handleChange` or `setValues(e.target.value)` */
    onChange: ChangeEventHandler<HTMLInputElement>;
    onBlur?: FocusEventHandler<HTMLInputElement>;
    autoComplete?: string;
    autoFocus?: boolean;
    maxLength?: number;
    /** type="number" only */
    min?: number | string;
    /** type="number" only */
    max?: number | string;
    /** type="number" only */
    step?: number | string;
};

/* ----------------------------- TextareaField ------------------------------ */

export type TextareaFieldProps = FieldBaseProps & {
    value: string;
    onChange: ChangeEventHandler<HTMLTextAreaElement>;
    onBlur?: FocusEventHandler<HTMLTextAreaElement>;
    rows?: number;
    maxLength?: number;
    /** Shows "12/500" in the corner (needs `maxLength`) */
    showCount?: boolean;
};

/* ------------------------------- SelectField ------------------------------ */

export type SelectOption = {
    value: string;
    label: string;
    disabled?: boolean;
};

export type SelectFieldProps = FieldBaseProps & {
    options: SelectOption[];
    /** The selected option's `value`, or '' for nothing selected */
    value: string;
    /** Gets the new value (not an event). With Formik: `(v) => formik.setFieldValue(name, v)` */
    onChange: (value: string) => void;
    /** Fires when the field loses focus while its list is closed */
    onBlur?: FocusEventHandler<HTMLButtonElement>;
};

/* -------------------------------- DateField ------------------------------- */

export type DateFieldProps = FieldBaseProps & {
    /** A date as "yyyy-MM-dd", or '' for no date */
    value: string;
    /** Gets the new date as "yyyy-MM-dd" (or '' when cleared), not an event */
    onChange: (value: string) => void;
    /** Fires when the field loses focus while its calendar is closed */
    onBlur?: FocusEventHandler<HTMLButtonElement>;
    /** Earliest selectable date, "yyyy-MM-dd" */
    minDate?: string;
    /** Latest selectable date, "yyyy-MM-dd" */
    maxDate?: string;
};

export type MultiSelectFieldProps = FieldBaseProps & {
    options: SelectOption[];
    /** The selected options' `value`s */
    value: string[];
    /** Gets the new array of values, not an event */
    onChange: (value: string[]) => void;
    onBlur?: () => void;
    /** Show the search box in the list (default true) */
    searchable?: boolean;
    /** Let the user add a value that is not in `options` by typing it (default false) */
    creatable?: boolean;
    /** Maximum number of selected values */
    maxSelected?: number;
    /** Shown when the search finds nothing */
    emptyText?: string;
    searchPlaceholder?: string;
};