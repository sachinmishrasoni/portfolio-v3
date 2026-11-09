
"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { FiLoader, FiLock, FiLogIn } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/forms";
import SpotlightCard from "@/components/common/SpotlightCard";

import {
    loginSchema,
    type LoginFormValues,
} from "./login.schema";

import { loginWithEmail, loginWithGoogle } from "./auth.service";
import { useState } from "react";
import { getAuthErrorMessage } from "./auth-errors";


const LoginForm: React.FC = () => {
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onSubmit",
        reValidateMode: "onBlur",
    });

    // Email and password login
    const handleLogin = async (values: LoginFormValues) => {
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);
            await loginWithEmail(values.email, values.password);

            toast.success("Login successful", {
                description: "Welcome back! Redirecting to your dashboard.",
            });

            router.replace("/admin");
            router.refresh();
        } catch (error) {
            console.error("Login failed:", error);

            toast.error("Login failed", {
                description: getAuthErrorMessage(error),
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Google login placeholder
    const handleGoogleLogin = async () => {
        if (isSubmitting || isGoogleSubmitting) return;

        try {
            setIsGoogleSubmitting(true);

            await loginWithGoogle();

            toast.success("Login successful", {
                description: "Welcome back! Redirecting to your dashboard.",
            });

            router.replace("/admin");
            router.refresh();
        } catch (error) {
            console.error("Google login failed:", error);

            toast.error("Google login failed", {
                description: getAuthErrorMessage(error),
            });
        } finally {
            setIsGoogleSubmitting(false);
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
                    Or continue with Google
                </span>

                <div className="h-px flex-1 bg-border" />
            </div>

            {/* Google Login */}
            <Button
                type="button"
                variant="outline"
                className="w-full gap-2 py-5"
                disabled={isSubmitting || isGoogleSubmitting}
                onClick={handleGoogleLogin}
            >
                {isGoogleSubmitting ? (
                    <>
                        <FiLoader className="mr-2 size-4 animate-spin" />
                        Connecting to Google...
                    </>
                ) : (
                    <>
                        <FcGoogle className="mr-2 size-5" />
                        Continue with Google
                    </>
                )}
            </Button>
        </SpotlightCard>
    );
};

export default LoginForm;
