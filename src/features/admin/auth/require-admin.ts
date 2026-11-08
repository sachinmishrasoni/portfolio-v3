import "server-only";

import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { connection } from "next/server";

export const requireAdmin = async () => {
    await connection();
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
        throw new Error("UNAUTHORIZED");
    }

    try {
        const decodedClaims = await adminAuth.verifySessionCookie(
            sessionCookie,
            true
        );

        const adminEmail = process.env.ADMIN_EMAIL
            ?.trim()
            .toLowerCase();

        if (
            !adminEmail ||
            decodedClaims.email?.toLowerCase() !== adminEmail
        ) {
            throw new Error("FORBIDDEN");
        }

        return decodedClaims;
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === "FORBIDDEN"
        ) {
            throw error;
        }

        throw new Error("UNAUTHORIZED");
    }
};
