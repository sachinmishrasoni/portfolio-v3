export type LoginField = 'email' | 'password';
export type LoginErrors = Partial<Record<LoginField, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Only checks that the fields are filled in properly. Whether they are *correct* is the server's job. */
export function validateLogin(values: { email: string; password: string }): LoginErrors {
    const errors: LoginErrors = {};

    const email = values.email.trim();
    if (!email) errors.email = 'Please enter your email.';
    else if (!EMAIL_PATTERN.test(email)) errors.email = 'That email doesn’t look right.';

    if (!values.password) errors.password = 'Please enter your password.';

    return errors;
}
