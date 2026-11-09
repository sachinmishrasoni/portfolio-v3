
import { FirebaseError } from "firebase/app";

export const getAuthErrorMessage = (error: unknown): string => {
    if (!(error instanceof FirebaseError)) {
        if (error instanceof Error) {
            return error.message;
        }

        return "Something went wrong. Please try again.";
    }

    switch (error.code) {
        // Email and password errors
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
            return "Invalid email or password.";

        case "auth/invalid-email":
            return "Please enter a valid email address.";

        case "auth/user-disabled":
            return "This account has been disabled.";

        case "auth/too-many-requests":
            return "Too many login attempts. Please try again later.";

        case "auth/network-request-failed":
            return "Network error. Please check your internet connection.";

        // Google authentication errors
        case "auth/popup-closed-by-user":
            return "Google sign-in was cancelled.";

        case "auth/popup-blocked":
            return "Your browser blocked the sign-in popup.";

        case "auth/cancelled-popup-request":
            return "Another sign-in popup is already open.";

        default:
            return "Unable to authenticate. Please try again.";
    }
};
