"use client";

import { signIn, fetchUserAttributes } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mapAuthError } from "@/lib/authError";

import { useAppDispatch } from "@/hooks/useRedux";
import { setCredentials } from "@/store/user/userSlice";
import {
    useLazyGetManagerMeQuery,
    useLazyGetTenantMeQuery,
    useCreateTenantMutation,
    useCreateManagerMutation,
} from "@/lib/apiSlice";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInForm() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // 🔑 Lazy queries (manual trigger)
    const [getTenantMe] = useLazyGetTenantMeQuery();
    const [getManagerMe] = useLazyGetManagerMeQuery();

    // 🆕 Mutations for lazy creation
    const [createTenant] = useCreateTenantMutation();
    const [createManager] = useCreateManagerMutation();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const form = new FormData(e.currentTarget);
        const email = form.get("email") as string;
        const password = form.get("password") as string;

        try {
            // 1️⃣ Cognito Sign In (JWT issued here)
            await signIn({ username: email, password });

            // 2️⃣ Get role from Cognito
            const attributes = await fetchUserAttributes();
            const role = attributes["custom:role"] as "tenant" | "manager";

            // 3️⃣ DB CHECK via RTK Query (PRODUCTION WAY)
            try {
                if (role === "tenant") {
                    await getTenantMe().unwrap();
                } else {
                    await getManagerMe().unwrap();
                }
            } catch (err: unknown) {
                // If 404, lazy create user
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if ((err as any)?.status === 404) {
                    const userData = {
                        name: attributes.name || "",
                        email: attributes.email || "",
                    };

                    if (role === "tenant") {
                        await createTenant(userData).unwrap();
                    } else {
                        await createManager(userData).unwrap();
                    }
                } else {
                    throw err; // Re-throw other errors
                }
            }

            if (role === "tenant") {
                router.replace("/");
            } else {
                router.replace("/manager");
            }

            // 4️⃣ Update Redux (UI state only)
            dispatch(
                setCredentials({
                    email: attributes.email || "",
                    name: attributes.name || "",
                    role,
                })
            );
        } catch (err: unknown) {
            /**
             * Possible failures:
             * - Invalid password
             * - JWT invalid
             * - DB entry missing (404 from /me)
             */
            setError(mapAuthError(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Welcome back</CardTitle>
                <CardDescription>Sign in to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email address</label>
                        <Input id="email" name="email" type="email" placeholder="name@example.com" required />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">Password</label>
                        <Input id="password" name="password" type="password" placeholder="••••••••" required />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Signing In..." : "Sign In"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/auth/sign-up")}>
                        Create account
                    </Button>
                </p>
                <Button variant="link" className="p-0 h-auto text-sm" onClick={() => router.push("/auth/forgot-password")}>
                    Forgot password?
                </Button>
            </CardFooter>
        </Card>
    );
}
