// src/app/api/debug-admin/route.ts  (delete after use)
import { NextResponse } from "next/server";
import { connection } from "next/server";

export async function GET() {
    await connection();

    const env = {
        FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
        FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
        FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
        ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
        node: process.version,
    };

    try {
        const { adminAuth } = await import("@/lib/firebase-admin");
        await adminAuth.listUsers(1);
        return NextResponse.json({ ok: true, env });
    } catch (e) {
        const err = e as Error;
        return NextResponse.json(
            { ok: false, env, name: err.name, message: err.message },
            { status: 500 }
        );
    }
}
