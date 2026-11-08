"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { FiLoader, FiLock, FiLogIn, FiMail } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/forms";

import {
    loginSchema,
    type LoginFormValues,
} from "./login.schema";
import SpotlightCard from "@/components/common/SpotlightCard";
import { loginWithEmail } from "./auth.service";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

type LoginFormProps = {
    onGoogleLogin?: () => void | Promise<void>;
    onLogin?: (values: LoginFormValues) => void | Promise<void>;
};

const LoginForm = ({ onGoogleLogin, onLogin }: LoginFormProps) => {
    const router = useRouter();
    const [message, setMessage] = useState("");

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onSubmit",
        reValidateMode: "onBlur",
    });

    const handleLogin = async (values: LoginFormValues) => {
        setMessage("");

        try {
            if (true) {
                // await onLogin(values);
                // console.log(values);
                await loginWithEmail(values.email, values.password);
                toast.add({
                    title: "Login successful",
                    description: "You have successfully logged in.",
                });
                router.replace("/admin");
                router.refresh();
            } else {
                setMessage("Login form validated. Connect your authentication service to continue.");
            }
        } catch {
            setMessage("Unable to sign in. Please check your credentials and try again.");
        }
    };

    const handleGoogleLogin = async () => {
        setMessage("");

        if (!onGoogleLogin) {
            setMessage("Google sign-in is not connected yet.");
            return;
        }

        try {
            await onGoogleLogin();
        } catch {
            setMessage("Google sign-in failed. Please try again.");
        }
    };

    return (
        <SpotlightCard className="mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
            {/* Header */}
            <div className="mb-7 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <FiLock size={25} />
                </div>

                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    Welcome back
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    Sign in to manage your portfolio.
                </p>
            </div>

            {/* Login Form */}
            <form
                noValidate
                onSubmit={handleSubmit(handleLogin)}
                className="space-y-4"
            >
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            id="login-email"
                            name={field.name}
                            type="email"
                            label="Email address"
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            disabled={isSubmitting}
                            error={errors.email?.message}
                        />
                    )}
                />

                <div className="space-y-2">
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                id="login-password"
                                name={field.name}
                                type="password"
                                label="Password"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                disabled={isSubmitting}
                                error={errors.password?.message}
                            />
                        )}
                    />
                </div>

                {/* Feedback */}
                {message && (
                    <p
                        role="status"
                        className="rounded-lg border border-border bg-muted/50 p-3 text-sm text-muted-foreground"
                    >
                        {message}
                    </p>
                )}

                {/* Submit */}
                <Button
                    type="submit"
                    className="h-11 w-full gap-2"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <FiLoader className="animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        <>
                            <FiLogIn />
                            Sign in
                        </>
                    )}
                </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-border" />
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Or continue with google
                </span>
                <div className="h-px flex-1 bg-border" />
            </div>

            {/* Google Login */}
            <Button
                type="button"
                variant="outline"
                className="h-11 w-full gap-3"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
            >
                <FcGoogle size={19} />
                Continue with Google
            </Button>
        </SpotlightCard>
    );
};

export default LoginForm;
