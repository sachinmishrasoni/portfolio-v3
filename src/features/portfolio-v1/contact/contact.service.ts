import { CONTACT_EMAIL } from './contact.data';
import type { ContactValues } from './contact.validation';

/**
 * 'sent'   → delivered to your form provider
 * 'mailto' → no provider configured, so the visitor's email app was opened with the message prefilled
 */
export type SendResult = 'sent' | 'mailto';

/**
 * Connect a provider by setting NEXT_PUBLIC_CONTACT_ENDPOINT (e.g. a Formspree / Web3Forms URL,
 * or your own /api/contact route). It receives a JSON POST with name, email, subject and message.
 */
export async function sendContactMessage(values: ContactValues): Promise<SendResult> {
    const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

    if (!endpoint) {
        const body = `${values.message.trim()}\n\n— ${values.name.trim()} (${values.email.trim()})`;
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
            values.subject.trim(),
        )}&body=${encodeURIComponent(body)}`;
        return 'mailto';
    }

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
            name: values.name.trim(),
            email: values.email.trim(),
            subject: values.subject.trim(),
            message: values.message.trim(),
        }),
    });

    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
    return 'sent';
}
