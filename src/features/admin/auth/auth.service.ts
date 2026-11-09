import { auth, googleProvider } from "@/lib/firebase";
import { deleteUser, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";


// Create server-side session using Firebase ID token
const createServerSession = async (user: {
    getIdToken: () => Promise<string>;
}) => {
    const idToken = await user.getIdToken();

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
        throw new Error(result.message || "Unable to create session.");
    }

    return result;
};

// Login with Email & Password
export const loginWithEmail = async (email: string, password: string) => {

    try {
        const credential = await signInWithEmailAndPassword(auth, email, password);

        await createServerSession(credential.user);

        return credential.user;
    } catch (error: any) {
        await signOut(auth);
        throw error;
    }
};


// Google login
export const loginWithGoogle = async () => {

    try {
        const credential = await signInWithPopup(auth, googleProvider);

        await createServerSession(credential.user);
        return credential.user;
    } catch (error) {
        await signOut(auth);
        throw error;
    }
};

// Logout
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
