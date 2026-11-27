import { NextResponse } from "next/server";

import { transporter } from "@/lib/mailer";
import { messageSchema } from "@/features/admin/messages/messages.schema";
import { contactEmailTemplate } from "@/features/portfolio/templates/contact-email.template";
import { autoReplyEmailTemplate } from "@/features/portfolio/templates/auto-reply-email.template";
import { readFile } from "node:fs/promises";
import path from "node:path";

const OWNER_NAME = "Emisam";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate form data
        const result = messageSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { success: false, message: "Invalid form data" },
                { status: 400 }
            );
        }

        const { name, email, subject, message, phone, company } = result.data;

        const iconBuffer = await readFile(
            path.join(process.cwd(), "public", "images", "icon.png")
        );

        const logoAttachment = {
            filename: "portfolio-icon.png",
            content: iconBuffer,
            contentType: "image/png",
            cid: "portfolio-logo",
            contentDisposition: "inline" as const,
        };

        // 1. Notification to you (if this fails, the request fails)
        await transporter.sendMail({
            from: {
                name: "Portfolio",
                address: process.env.SMTP_USER!,
            },
            to: process.env.CONTACT_EMAIL!,
            replyTo: email,
            subject: `New Portfolio Message: ${subject}`,
            html: contactEmailTemplate({
                name,
                email,
                subject,
                message,
                phone,
                company,
            }),
            attachments: [logoAttachment],
        });

        // 2. Confirmation to the sender (failure should not break the form)
        try {
            await transporter.sendMail({
                from: {
                    name: OWNER_NAME,
                    address: process.env.SMTP_USER!,
                },
                to: email,
                replyTo: process.env.CONTACT_EMAIL!,
                subject: "Thanks for reaching out!",
                html: autoReplyEmailTemplate({
                    name,
                    subject,
                    message,
                    ownerName: OWNER_NAME,
                }),
                attachments: [logoAttachment],
            });
        } catch (autoReplyError) {
            console.error("Auto-reply email error:", autoReplyError);
        }

        return NextResponse.json({
            success: true,
            message: "Email sent successfully",
        });
    } catch (error) {
        console.error("Contact email error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to send email. Please try again later.",
            },
            { status: 500 }
        );
    }
}