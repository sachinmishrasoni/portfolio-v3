import { escapeHtml, toHtmlWithBreaks } from "@/lib/utils/email.utils";

interface ContactEmailProps {
    name: string;
    email: string;
    subject: string;
    message: string;
    phone?: string | null;
    company?: string | null;
}

export function contactEmailTemplate({
    name,
    email,
    subject,
    message,
    phone,
    company,
}: ContactEmailProps): string {
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safePhone = escapeHtml(phone || "—");
    const safeCompany = escapeHtml(company || "—");
    const safeMessageHtml = toHtmlWithBreaks(message);
    const replySubject = encodeURIComponent(`Re: ${subject}`);

    return `
<div style="margin:0;padding:0;background-color:#f1f5f9;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
        ${safeName} sent you a message: ${safeSubject}
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
                                    <td align="right" valign="middle">
                                        <span style="display:inline-block;padding:5px 12px;background:rgba(147,197,253,0.18);color:#bfdbfe;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;border-radius:999px;">
                                            New Inquiry
                                        </span>
                                    </td>
                                </tr>
                            </table>

                            <h1 style="margin:28px 0 6px;font-size:26px;line-height:1.3;color:#ffffff;font-weight:700;">
                                You have a new message
                            </h1>
                            <p style="margin:0;color:#cbd5e1;font-size:14px;line-height:1.6;">
                                Someone reached out through your portfolio contact form.
                            </p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:32px;">

                            <p style="margin:0 0 12px;color:#64748b;font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;">
                                Sender Details
                            </p>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                                style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;font-size:14px;">
                                <tr>
                                    <td style="padding:14px 18px 6px;color:#64748b;width:100px;">Name</td>
                                    <td style="padding:14px 18px 6px;color:#0f172a;font-weight:600;">${safeName}</td>
                                </tr>
                                <tr>
                                    <td style="padding:6px 18px;color:#64748b;">Email</td>
                                    <td style="padding:6px 18px;">
                                        <a href="mailto:${safeEmail}" style="color:#2563eb;text-decoration:none;">${safeEmail}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:6px 18px;color:#64748b;">Phone</td>
                                    <td style="padding:6px 18px;color:#0f172a;">${safePhone}</td>
                                </tr>
                                <tr>
                                    <td style="padding:6px 18px 14px;color:#64748b;">Company</td>
                                    <td style="padding:6px 18px 14px;color:#0f172a;">${safeCompany}</td>
                                </tr>
                            </table>

                            <p style="margin:28px 0 8px;color:#64748b;font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;">
                                Subject
                            </p>
                            <p style="margin:0;color:#0f172a;font-size:18px;font-weight:700;line-height:1.4;">
                                ${safeSubject}
                            </p>

                            <p style="margin:28px 0 8px;color:#64748b;font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;">
                                Message
                            </p>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="left" valign="top" style="padding:16px 20px;background:#ffffff;border:1px solid #e2e8f0;border-left:4px solid #2563eb;border-radius:8px;color:#334155;font-size:15px;line-height:1.75;text-align:left;word-break:break-word;">${safeMessageHtml}</td>
                                </tr>
                            </table>

                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:32px auto 0;">
                                <tr>
                                    <td align="center" style="background:#2563eb;border-radius:10px;">
                                        <a href="mailto:${safeEmail}?subject=${replySubject}"
                                            style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:10px;">
                                            Reply to ${safeName} &rarr;
                                        </a>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding:22px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
                            <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.7;">
                                This notification was generated from your portfolio contact form.<br />
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