'use client';

import React, { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { FiAlertCircle, FiCheck, FiEye, FiEyeOff, FiLoader, FiLogIn } from 'react-icons/fi';
import { validateLogin, type LoginErrors, type LoginField } from './login.validation';

type Status = 'idle' | 'submitting' | 'success' | 'error';

// Floating-label fields (same approach as the contact form):
// empty + unfocused → the label sits like a placeholder; focused or filled → it floats up as a caption.
const baseField =
    'peer h-12 w-full rounded-xl border bg-background/60 px-4 pt-4 font-mono text-sm text-foreground placeholder-transparent transition-[border-color,box-shadow] duration-200 focus:outline-none focus:ring-4 disabled:opacity-70';
const okField = 'border-border focus:border-primary/60 focus:ring-primary/15';
const badField = 'border-destructive/70 focus:border-destructive focus:ring-destructive/15';

const labelBase =
    'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground transition-all duration-200 ' +
    'peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-wider ' +
    'peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-wider';
const labelOk = 'peer-focus:text-primary peer-[:not(:placeholder-shown)]:text-primary';
const labelBad = 'peer-focus:text-destructive peer-[:not(:placeholder-shown)]:text-destructive';

type LoginFormProps = {
    /** Where to go after signing in. Already checked on the server with safeNextPath(). */
    redirectTo: string;
};

const LoginForm: React.FC<LoginFormProps> = ({ redirectTo }) => {
    const reduce = useReducedMotion();
    const router = useRouter();
    const uid = useId();

    const [values, setValues] = useState({ email: '', password: '', remember: false });
    // Errors on screen: set on submit, cleared while typing, re-checked per field on blur (after a submit)
    const [errors, setErrors] = useState<LoginErrors>({});
    const [submitted, setSubmitted] = useState(false);
    const [status, setStatus] = useState<Status>('idle');
    const [serverError, setServerError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [capsLock, setCapsLock] = useState(false);

    const fieldId = (field: LoginField) => `${uid}-${field}`;
    const busy = status === 'submitting' || status === 'success';

    const handleChange =
        (field: LoginField) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setValues((prev) => ({ ...prev, [field]: e.target.value }));
            setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
            if (status === 'error') setStatus('idle');
        };

    const handleBlur = (field: LoginField) => (e: React.FocusEvent<HTMLInputElement>) => {
        if (field === 'password') setCapsLock(false);
        if (!submitted) return;
        const fieldError = validateLogin({ ...values, [field]: e.target.value })[field];
        setErrors((prev) => ({ ...prev, [field]: fieldError }));
    };

    const detectCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) =>
        setCapsLock(e.getModifierState('CapsLock'));

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        // e.preventDefault();
        // if (busy) return;

        // const found = validateLogin(values);
        // setErrors(found);
        // setSubmitted(true);

        // const firstInvalid: LoginField | undefined = found.email
        //     ? 'email'
        //     : found.password
        //       ? 'password'
        //       : undefined;
        // if (firstInvalid) {
        //     document.getElementById(fieldId(firstInvalid))?.focus();
        //     return;
        // }

        // setStatus('submitting');
        // setServerError('');

        // try {
        //     await loginRequest(values);
        //     setStatus('success');
        //     router.replace(redirectTo);
        //     router.refresh();
        // } catch (error) {
        //     setServerError(
        //         error instanceof AuthError
        //             ? error.message
        //             : 'Couldn’t reach the server. Check your connection and try again.',
        //     );
        //     setStatus('error');
        //     // Wrong credentials: clear the password and put the cursor back in it
        //     setValues((prev) => ({ ...prev, password: '' }));
        //     requestAnimationFrame(() => document.getElementById(fieldId('password'))?.focus());
        // }
    };

    const renderError = (field: LoginField) => (
        <AnimatePresence initial={false}>
            {errors[field] && (
                <motion.p
                    id={`${fieldId(field)}-error`}
                    initial={reduce ? false : { opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-1.5 px-1 text-xs text-destructive"
                >
                    {errors[field]}
                </motion.p>
            )}
        </AnimatePresence>
    );

    return (
        <form noValidate onSubmit={handleSubmit} className="space-y-4">
            {/* Server error (wrong password, too many attempts…) */}
            <AnimatePresence initial={false}>
                {status === 'error' && serverError && (
                    <motion.div
                        role="alert"
                        initial={reduce ? false : { opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0 }}
                        className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm text-destructive"
                    >
                        <FiAlertCircle className="mt-0.5 shrink-0" />
                        <span>{serverError}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Email */}
            <div>
                <div className="relative">
                    <input
                        id={fieldId('email')}
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="username"
                        autoFocus
                        placeholder=" "
                        value={values.email}
                        onChange={handleChange('email')}
                        onBlur={handleBlur('email')}
                        disabled={busy}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? `${fieldId('email')}-error` : undefined}
                        className={`${baseField} ${errors.email ? badField : okField}`}
                    />
                    <label
                        htmlFor={fieldId('email')}
                        className={`${labelBase} ${errors.email ? labelBad : labelOk}`}
                    >
                        Email
                    </label>
                </div>
                {renderError('email')}
            </div>

            {/* Password */}
            <div>
                <div className="relative">
                    <input
                        id={fieldId('password')}
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder=" "
                        value={values.password}
                        onChange={handleChange('password')}
                        onBlur={handleBlur('password')}
                        onKeyDown={detectCapsLock}
                        onKeyUp={detectCapsLock}
                        disabled={busy}
                        aria-invalid={Boolean(errors.password)}
                        aria-describedby={
                            errors.password ? `${fieldId('password')}-error` : undefined
                        }
                        className={`${baseField} pr-12 ${errors.password ? badField : okField}`}
                    />
                    <label
                        htmlFor={fieldId('password')}
                        className={`${labelBase} ${errors.password ? labelBad : labelOk}`}
                    >
                        Password
                    </label>
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        disabled={busy}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        aria-pressed={showPassword}
                        className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
                    >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                </div>
                {renderError('password')}

                <AnimatePresence initial={false}>
                    {capsLock && (
                        <motion.p
                            initial={reduce ? false : { opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduce ? undefined : { opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-1.5 px-1 text-xs text-amber-600 dark:text-amber-400"
                        >
                            Caps Lock is on.
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>

            {/* Remember me */}
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
                <input
                    type="checkbox"
                    checked={values.remember}
                    onChange={(e) => setValues((prev) => ({ ...prev, remember: e.target.checked }))}
                    disabled={busy}
                    className="size-4 rounded border-border accent-primary"
                />
                Keep me signed in for 30 days
            </label>

            <motion.button
                type="submit"
                disabled={busy}
                whileHover={reduce || busy ? undefined : { scale: 1.01 }}
                whileTap={reduce || busy ? undefined : { scale: 0.98 }}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-80"
            >
                {status === 'submitting' ? (
                    <>
                        <FiLoader className="animate-spin" />
                        Signing in…
                    </>
                ) : status === 'success' ? (
                    <>
                        <FiCheck />
                        Signed in
                    </>
                ) : (
                    <>
                        <FiLogIn />
                        Sign in
                    </>
                )}
            </motion.button>
        </form>
    );
};

export default LoginForm;
