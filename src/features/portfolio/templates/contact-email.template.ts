
interface ContactEmailTemplateProps {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    subject: string;
    message: string;
}

const escapeHtml = (value: string): string =>
    value.replace(/[&<>"']/g, (char) => {
        const entities: Record<string, string> = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        };

        return entities[char];
    });

export const contactEmailTemplate = ({
    name,
    email,
    phone,
    company,
    subject,
    message,
}: ContactEmailTemplateProps): string => {
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || "Not provided");
    const safeCompany = escapeHtml(company || "Not provided");
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

    return `
    <div style="margin:0;padding:0px;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;">

        <!-- Header -->
        <div style="padding:24px 18px;background:#111827;color:#ffffff;">
          <p style="margin:0 0 10px;color:#93c5fd;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">
            Portfolio Notification
          </p>
          <h1 style="margin:0;font-size:24px;line-height:1.4;">
            New Contact Inquiry
          </h1>
          <p style="margin:8px 0 0;color:#d1d5db;font-size:14px;">
            Someone has reached out through your portfolio.
          </p>
        </div>

        <!-- Content -->
        <div style="padding:16px 20px;">

          <div style="margin-bottom:24px;padding:12px 16px;background:#eff6ff;border-radius:8px;border-left:4px solid #2563eb;">
            <p style="margin:0;color:#1d4ed8;font-size:13px;font-weight:600;">
              NEW MESSAGE RECEIVED
            </p>
          </div>

          <h2 style="margin:0 0 16px;color:#111827;font-size:17px;">
            Sender Information
          </h2>

          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr>
              <td style="padding:8px 0;color:#6b7280;width:110px;">Name</td>
              <td style="padding:8px 0;color:#111827;font-weight:600;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;">Email</td>
              <td style="padding:8px 0;color:#2563eb;">${safeEmail}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;">Phone</td>
              <td style="padding:8px 0;color:#111827;">${safePhone}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;">Company</td>
              <td style="padding:10px 0;color:#111827;">${safeCompany}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;">Subject</td>
              <td style="padding:8px 0;color:#111827;font-weight:600;">${safeSubject}</td>
            </tr>
          </table>

          <div style="height:1px;background:#e5e7eb;margin:24px 0;"></div>

          <h2 style="margin:0 0 12px;color:#111827;font-size:17px;">
            Message
          </h2>

          <div style="padding:12px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;">
            <p style="margin:0;color:#374151;font-size:14px;line-height:1.8;">
              ${safeMessage}
            </p>
          </div>

          <!-- Reply Button -->
          <div style="margin-top:28px;text-align:center;">
            <a
              href="mailto:${encodeURIComponent(email)}"
              style="display:inline-block;padding:13px 26px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;"
            >
              Reply to ${safeName}
            </a>
          </div>

        </div>

        <!-- Footer -->
        <div style="padding:20px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
          <p style="margin:0;color:#6b7280;font-size:12px;line-height:1.7;">
            This notification was generated from your portfolio contact form.
            <br />
            &copy; ${new Date().getFullYear()} Portfolio. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  `;
};
