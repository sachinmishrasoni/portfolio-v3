import type { ChangeEventHandler, FocusEventHandler } from 'react';

export type FieldVariant = 'floating' | 'border' | 'top';

/** Props that every field in this folder accepts */
export type FieldBaseProps = {
    /** Used for the control's `id`, and ties the label, error and hint to it */
    id: string;
    /** The field's `name`, so it is submitted with the form */
    name: string;
    /** The floating label */
    label: string;
    /** Shown inside the field only while it is focused (the label sits in its place otherwise) */
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
    
    /**
     * floating: label floats inside the field (default)
     * border:   label sits on the top border when focused / filled
     * top:      label always sits above the field
     */
    variant?: FieldVariant;
};

/* ------------------------------- TextField -------------------------------- */

export type TextFieldType = 'text' | 'email' | 'password';

export type TextFieldProps = FieldBaseProps & {
    type?: TextFieldType;
    value: string;
    /** A normal change event, so it works with `formik.handleChange` or `setValues(e.target.value)` */
    onChange: ChangeEventHandler<HTMLInputElement>;
    onBlur?: FocusEventHandler<HTMLInputElement>;
    autoComplete?: string;
    autoFocus?: boolean;
    maxLength?: number;
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
