"use client";

import { signUp } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { mapAuthError } from "@/lib/authError";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateManagerMutation, useCreateTenantMutation } from "@/lib/apiSlice";

export default function SignUpForm() {
    const router = useRouter();
    const [createTenant] = useCreateTenantMutation();
    const [createManager] = useCreateManagerMutation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const form = new FormData(e.currentTarget);
        const name = form.get("name") as string;
        const role = form.get("role") as "tenant" | "manager";
        const email = form.get("email") as string;
        const password = form.get("password") as string;
        const confirm = form.get("confirm") as string;

        if (password !== confirm) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const result = await signUp({
                username: email,
                password,
                options: {
                    userAttributes: {
                        name,
                        email,
                        "custom:role": role,
                    },
                },
            });

            const userData = {
                cognito_sub: result.userId,
                name,
                email,
            };

            if (role === "tenant") {
                await createTenant(userData).unwrap();
            } else {
                await createManager(userData).unwrap();
            }

            // 🔑 handle both Cognito configurations
            if (result.nextStep?.signUpStep === "CONFIRM_SIGN_UP") {
                router.replace(`/auth/verify?email=${encodeURIComponent(email)}`);
            } else {
                router.replace("/auth/sign-in");
            }
        } catch (err: unknown) {
            setError(mapAuthError(err))
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Create your account</CardTitle>
                <CardDescription>Start your journey with us</CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-3">
                        <label htmlFor="name" className="text-sm font-medium">
                            Full name
                        </label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email address
                        </label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <label htmlFor="password" className="text-sm font-medium">
                            Password
                        </label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <label htmlFor="confirm" className="text-sm font-medium">
                            Confirm password
                        </label>
                        <Input
                            id="confirm"
                            name="confirm"
                            type="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div className="space-y-3">
                        <label htmlFor="role" className="text-sm font-medium">
                            Role
                        </label>
                        <Select
                            name="role"
                            required
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem value="tenant">Tenant</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creating account..." : "Create account"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center">
                <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => router.push("/auth/sign-in")}
                    >
                        Sign in
                    </Button>
                </p>
            </CardFooter>
        </Card>
    );
}
