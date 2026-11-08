import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

const allowedEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

/** Login with Email & Password */
export const loginWithEmail = async (email: string, password: string) => {
    if (email !== allowedEmail) {
        throw new Error("This email is not allowed to log in.");
    }

    try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const user = credential.user;

        if (user.email !== allowedEmail) {
            throw new Error("Only the admin can link their Google account.");
        }

        // 2. Get Firebase ID token
        const idToken = await user.getIdToken();

        // 3. Create HTTP-only session
        const response = await fetch("/api/auth/session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ idToken }),
        });

        const result = await response.json();

        if (!response.ok) {
            // Avoid leaving a client-side Firebase session active
            // when server session creation fails.
            await signOut(auth);

            throw new Error(result.message || "Session creation failed");
        }

        return user;
    } catch (error: any) {
        console.error("Email login error:", error.code, error.message);
        throw new Error(error.message || "Invalid credentials. Please check your email and password.");
    }
};

/** Logout */
export const logout = async () => {
    try {
        // 1. Clear the server-side session cookie
        const response = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Unable to end server session.");
        }

        // 2. Clear Firebase client authentication
        await signOut(auth);
    } catch (error) {
        console.error("Logout error:", error);
        throw error;
    }
};
