'use client';

import React, { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { FiAlertCircle, FiCheck, FiLoader, FiSend } from 'react-icons/fi';
import { CONTACT_EMAIL } from './contact.data';
import { sendContactMessage, type SendResult } from './contact.service';
import {
    EMPTY_VALUES,
    MESSAGE_MAX,
    validateContact,
    type ContactErrors,
    type ContactField,
    type ContactValues,
} from './contact.validation';

const EASE = [0.22, 1, 0.36, 1] as const;

type Status = 'idle' | 'submitting' | 'success' | 'error';

const FIELD_ORDER: ContactField[] = ['name', 'email', 'subject', 'message'];

const INPUTS: {
    name: Exclude<ContactField, 'message'>;
    label: string;
    type: string;
    autoComplete: string;
    /** Spans both columns on sm+ */
    full?: boolean;
}[] = [
        { name: 'name', label: 'Name', type: 'text', autoComplete: 'name' },
        { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
        { name: 'subject', label: 'Subject', type: 'text', autoComplete: 'off', full: true },
    ];

// Floating-label fields: the input uses placeholder=" " so `:placeholder-shown` tells us if it's empty.
// Empty + unfocused → the label sits like a placeholder. Focused or filled → it floats up as a small caption.
const baseField =
    'peer w-full rounded-xl border bg-background/60 px-4 font-mono text-sm text-foreground placeholder-transparent transition-[border-color,box-shadow] duration-200 focus:outline-none focus:ring-4 disabled:opacity-70';
const okField = 'border-border focus:border-primary/60 focus:ring-primary/15';
const badField = 'border-destructive/70 focus:border-destructive focus:ring-destructive/15';

const labelBase =
    'pointer-events-none absolute left-4 font-mono text-sm text-muted-foreground transition-all duration-200 ' +
    'peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-wider ' +
    'peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-wider';
const labelOk = 'peer-focus:text-primary peer-[:not(:placeholder-shown)]:text-primary';
const labelBad = 'peer-focus:text-destructive peer-[:not(:placeholder-shown)]:text-destructive';
const labelSingleLine = 'top-1/2 -translate-y-1/2';
const labelMultiLine = 'top-3.5';

const ContactForm: React.FC = () => {
    const reduce = useReducedMotion();
    const uid = useId();

    const [values, setValues] = useState<ContactValues>(EMPTY_VALUES);
    // The errors currently on screen: set on submit, cleared while typing, re-checked per field on blur.
    const [errors, setErrors] = useState<ContactErrors>({});
    const [submitted, setSubmitted] = useState(false);
    const [honeypot, setHoneypot] = useState('');
    const [status, setStatus] = useState<Status>('idle');
    const [via, setVia] = useState<SendResult>('sent');

    const errorFor = (field: ContactField) => errors[field];

    const fieldId = (field: ContactField) => `${uid}-${field}`;

    const handleChange =
        (field: ContactField) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setValues((prev) => ({ ...prev, [field]: e.target.value }));
                // Hide this field's error as soon as the user starts typing; it is re-checked on blur
                setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
                if (status === 'error') setStatus('idle');
            };

    // Before the first submit nothing is validated. After it, a field re-validates when it loses focus.
    const handleBlur =
        (field: ContactField) =>
            (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                if (!submitted) return;
                const fieldError = validateContact({ ...values, [field]: e.target.value })[field];
                setErrors((prev) => ({ ...prev, [field]: fieldError }));
            };

    const reset = () => {
        setValues(EMPTY_VALUES);
        setErrors({});
        setSubmitted(false);
        setStatus('idle');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (status === 'submitting') return;

        // Validate everything on submit and show all the errors at once
        const found = validateContact(values);
        setErrors(found);
        setSubmitted(true);

        const firstInvalid = FIELD_ORDER.find((field) => found[field]);
        if (firstInvalid) {
            document.getElementById(fieldId(firstInvalid))?.focus();
            return;
        }

        // Bots fill the hidden field; pretend it worked and send nothing
        if (honeypot) {
            setVia('sent');
            setStatus('success');
            return;
        }

        setStatus('submitting');
        try {
            setVia(await sendContactMessage(values));
            setStatus('success');
        } catch {
            setStatus('error');
        }
    };

    const submitting = status === 'submitting';

    const renderError = (field: ContactField) => {
        const message = errorFor(field);
        return (
            <AnimatePresence initial={false}>
                {message && (
                    <motion.p
                        id={`${fieldId(field)}-error`}
                        initial={reduce ? false : { opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-1.5 px-1 text-xs text-destructive"
                    >
                        {message}
                    </motion.p>
                )}
            </AnimatePresence>
        );
    };

    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="rounded-2xl border border-border bg-card/60 p-5 shadow-2xl backdrop-blur-sm shadow-primary/5 sm:p-8"
        >
            <AnimatePresence mode="wait" initial={false}>
                {status === 'success' ? (
                    <motion.div
                        key="success"
                        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={reduce ? undefined : { opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        role="status"
                        className="flex min-h-[22rem] flex-col items-center justify-center text-center"
                    >
                        <span className="flex size-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-2xl text-emerald-600 dark:text-emerald-400">
                            <FiCheck />
                        </span>
                        <h3 className="mt-6 text-2xl font-semibold text-foreground">
                            {via === 'sent' ? 'Message sent' : 'Almost there'}
                        </h3>
                        <p className="mt-3 max-w-sm text-muted-foreground">
                            {via === 'sent'
                                ? 'Thanks for reaching out — I’ll get back to you soon.'
                                : 'Your email app should have opened with the message ready. Press send there to finish.'}
                        </p>
                        <button
                            type="button"
                            onClick={reset}
                            className="mt-8 rounded-xl border border-border bg-background/60 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                            Send another message
                        </button>
                    </motion.div>
                ) : (
                    <motion.form
                        key="form"
                        noValidate
                        onSubmit={handleSubmit}
                        initial={reduce ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={reduce ? undefined : { opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <h3 className="text-lg font-semibold text-foreground">Send a message</h3>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                            Fill in the form and I’ll get back to you as soon as I can.
                        </p>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            {INPUTS.map(({ name, label, type, autoComplete, full }) => {
                                const hasError = Boolean(errorFor(name));
                                return (
                                    <div key={name} className={full ? 'sm:col-span-2' : undefined}>
                                        <div className="relative">
                                            <input
                                                id={fieldId(name)}
                                                name={name}
                                                type={type}
                                                autoComplete={autoComplete}
                                                placeholder=" "
                                                value={values[name]}
                                                onChange={handleChange(name)}
                                                onBlur={handleBlur(name)}
                                                disabled={submitting}
                                                aria-invalid={hasError}
                                                aria-describedby={
                                                    hasError ? `${fieldId(name)}-error` : undefined
                                                }
                                                className={`h-12 pt-4 ${baseField} ${hasError ? badField : okField
                                                    }`}
                                            />
                                            <label
                                                htmlFor={fieldId(name)}
                                                className={`${labelBase} ${labelSingleLine} ${hasError ? labelBad : labelOk
                                                    }`}
                                            >
                                                {label}
                                            </label>
                                        </div>
                                        {renderError(name)}
                                    </div>
                                );
                            })}

                            <div className="sm:col-span-2">
                                <div className="relative">
                                    <textarea
                                        id={fieldId('message')}
                                        name="message"
                                        placeholder=" "
                                        rows={4}
                                        maxLength={MESSAGE_MAX + 200}
                                        value={values.message}
                                        onChange={handleChange('message')}
                                        onBlur={handleBlur('message')}
                                        disabled={submitting}
                                        aria-invalid={Boolean(errorFor('message'))}
                                        aria-describedby={
                                            errorFor('message')
                                                ? `${fieldId('message')}-error`
                                                : undefined
                                        }
                                        className={`min-h-32 resize-none pb-7 pt-7 ${baseField} ${errorFor('message') ? badField : okField
                                            }`}
                                    />
                                    <label
                                        htmlFor={fieldId('message')}
                                        className={`${labelBase} ${labelMultiLine} ${errorFor('message') ? labelBad : labelOk
                                            }`}
                                    >
                                        Message
                                    </label>
                                    <span
                                        aria-hidden
                                        className={`pointer-events-none absolute bottom-2 right-4 font-mono text-[10px] ${values.message.length > MESSAGE_MAX
                                            ? 'text-destructive'
                                            : 'text-muted-foreground'
                                            }`}
                                    >
                                        {values.message.length}/{MESSAGE_MAX}
                                    </span>
                                </div>
                                {renderError('message')}
                            </div>

                            {/* Honeypot: hidden from people, tempting for bots */}
                            <input
                                type="text"
                                name="website"
                                tabIndex={-1}
                                autoComplete="off"
                                aria-hidden
                                value={honeypot}
                                onChange={(e) => setHoneypot(e.target.value)}
                                className="absolute -left-[9999px] size-0 opacity-0"
                            />
                        </div>

                        <AnimatePresence initial={false}>
                            {status === 'error' && (
                                <motion.div
                                    role="alert"
                                    initial={reduce ? false : { opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={reduce ? undefined : { opacity: 0 }}
                                    className="mt-4 flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm text-destructive"
                                >
                                    <FiAlertCircle className="mt-0.5 shrink-0" />
                                    <span>
                                        Something went wrong sending your message. Please try
                                        again, or email me at{' '}
                                        <a
                                            href={`mailto:${CONTACT_EMAIL}`}
                                            className="font-medium underline underline-offset-2"
                                        >
                                            {CONTACT_EMAIL}
                                        </a>
                                        .
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            type="submit"
                            disabled={submitting}
                            whileHover={reduce || submitting ? undefined : { scale: 1.01 }}
                            whileTap={reduce || submitting ? undefined : { scale: 0.98 }}
                            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 py-3 px-6 cursor-pointer transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-80"
                        >
                            {submitting ? (
                                <>
                                    <FiLoader className="animate-spin" />
                                    Sending…
                                </>
                            ) : (
                                <>
                                    <FiSend />
                                    Send Message
                                </>
                            )}
                        </motion.button>
                    </motion.form>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ContactForm;
