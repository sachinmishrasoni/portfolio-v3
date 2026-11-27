import { escapeHtml, toHtmlWithBreaks } from "@/lib/utils/email.utils";

interface AutoReplyEmailProps {
    name: string;
    subject: string;
    message: string;
    ownerName: string;
}

export function autoReplyEmailTemplate({
    name,
    subject,
    message,
    ownerName,
}: AutoReplyEmailProps): string {
    const safeName = escapeHtml(name);
    const safeSubject = escapeHtml(subject);
    const safeOwner = escapeHtml(ownerName);
    const safeMessageHtml = toHtmlWithBreaks(message);

    return `
<div style="margin:0;padding:0;background-color:#f1f5f9;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
        Thanks for reaching out, ${safeName}! I've received your message.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f1f5f9;padding:32px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
                    style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">

                    <!-- Header -->
                    <tr>
                        <td style="background:#0f172a;background-image:linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%);padding:28px 32px;">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td width="52" valign="middle">
                                        <img src="cid:portfolio-logo" alt="Portfolio Logo" width="42" height="42" style="display:block;border-radius:10px;border:0;" />
                                    </td>
                                    <td valign="middle" style="font-size:18px;font-weight:700;color:#ffffff;letter-spacing:0.3px;">
                                        Portfolio
                                    </td>
                                </tr>
                            </table>

                            <h1 style="margin:28px 0 6px;font-size:26px;line-height:1.3;color:#ffffff;font-weight:700;">
                                Thanks for reaching out!
                            </h1>
                            <p style="margin:0;color:#cbd5e1;font-size:14px;line-height:1.6;">
                                Your message has been received.
                            </p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:32px;color:#334155;font-size:15px;line-height:1.75;">
                            <p style="margin:0 0 16px;">Hi <strong style="color:#0f172a;">${safeName}</strong>,</p>
                            <p style="margin:0 0 16px;">
                                Thank you for contacting me. I've received your message and will get back to you as soon as possible, usually within 24–48 hours.
                            </p>

                            <p style="margin:24px 0 8px;color:#64748b;font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;">
                                Your Message
                            </p>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="left" valign="top" style="padding:16px 20px;background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #2563eb;border-radius:8px;color:#334155;font-size:14px;line-height:1.75;text-align:left;word-break:break-word;"><strong style="color:#0f172a;">${safeSubject}</strong><br /><br />${safeMessageHtml}</td>
                                </tr>
                            </table>

                            <p style="margin:24px 0 0;">
                                Best regards,<br />
                                <strong style="color:#0f172a;">${safeOwner}</strong>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding:22px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
                            <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.7;">
                                This is an automated confirmation of your message.<br />
                                &copy; ${new Date().getFullYear()} Portfolio. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</div>
`;
}