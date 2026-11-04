export type ContactValues = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

export type ContactField = keyof ContactValues;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const EMPTY_VALUES: ContactValues = { name: '', email: '', subject: '', message: '' };

export const MESSAGE_MAX = 1000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(values: ContactValues): ContactErrors {
    const errors: ContactErrors = {};

    const name = values.name.trim();
    if (!name) errors.name = 'Please tell me your name.';
    else if (name.length < 2) errors.name = 'Name must be at least 2 characters.';

    const email = values.email.trim();
    if (!email) errors.email = 'Please enter your email.';
    else if (!EMAIL_PATTERN.test(email)) errors.email = 'That email doesn’t look right.';

    const subject = values.subject.trim();
    if (!subject) errors.subject = 'Please add a subject.';
    else if (subject.length < 3) errors.subject = 'Subject must be at least 3 characters.';

    const message = values.message.trim();
    if (!message) errors.message = 'Please write a message.';
    else if (message.length < 10) errors.message = 'Message must be at least 10 characters.';
    else if (message.length > MESSAGE_MAX) errors.message = `Keep it under ${MESSAGE_MAX} characters.`;

    return errors;
}
