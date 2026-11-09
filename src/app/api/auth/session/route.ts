import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

const EXPIRES_IN = 5 * 24 * 60 * 60 * 1000;

export async function POST(request: NextRequest) {
    try {
        const { idToken } = await request.json();

        if (!idToken) {
            return NextResponse.json(
                { success: false, message: "ID token is required" },
                { status: 400 }
            );
        }

        // 1. Verify Firebase ID token
        const decodedToken = await adminAuth.verifyIdToken(idToken);

        // 2. Check admin authorization
        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const userEmail = decodedToken.email?.trim().toLowerCase();

        if (!adminEmail || userEmail !== adminEmail) {
            return NextResponse.json(
                { success: false, message: "Your account is not authorized to access this dashboard." },
                { status: 403 }
            );
        }

        // 3. Create session cookie
        const sessionCookie = await adminAuth.createSessionCookie(
            idToken,
            { expiresIn: EXPIRES_IN }
        );

        // 4. Set HTTP-only cookie
        const response = NextResponse.json({
            success: true,
            message: "Login successful",
        });

        response.cookies.set("session", sessionCookie, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: EXPIRES_IN / 1000,
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Session creation error:", error);

        return NextResponse.json(
            { success: false, message: "Unable to create session" },
            { status: 401 }
        );
    }
}