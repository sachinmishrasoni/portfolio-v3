
import { NextResponse } from "next/server";

import { resend } from "@/lib/resend";
import { messageSchema } from "@/features/admin/messages/messages.schema";
import { contactEmailTemplate } from "@/features/portfolio/templates/contact-email.template";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate submitted data
        const result = messageSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid form data",
                },
                { status: 400 }
            );
        }

        const { name, email, subject, message, phone, company } = result.data;

        // Send email notification
        const { error } = await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: [process.env.CONTACT_EMAIL!],
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
        });

        if (error) {
            console.error("Resend error:", error);

            return NextResponse.json(
                {
                    success: false,
                    message: "Unable to send email",
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Email sent successfully",
        });
    } catch (error) {
        console.error("Contact API error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 }
        );
    }
}
