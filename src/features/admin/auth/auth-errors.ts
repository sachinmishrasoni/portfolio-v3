
import { FirebaseError } from "firebase/app";

export const getAuthErrorMessage = (error: unknown): string => {
    if (error instanceof Error && !(error instanceof FirebaseError)) {
        return error.message;
    }

    if (!(error instanceof FirebaseError)) {
        return "Something went wrong. Please try again.";
    }

    switch (error.code) {
        case "auth/invalid-email":
            return "Please enter a valid email address.";

        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
            return "Invalid email or password.";

        case "auth/user-disabled":
            return "This account has been disabled.";

        case "auth/too-many-requests":
            return "Too many attempts. Please try again later.";

        case "auth/network-request-failed":
            return "Network error. Please check your internet connection.";

        default:
            return "Unable to sign in. Please try again.";
    }
};
