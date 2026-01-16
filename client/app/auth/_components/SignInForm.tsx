"use client";

import { signIn, fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { mapAuthError } from "@/lib/authError";
import { setCredentials } from "@/store/user/userSlice";
import { useAppDispatch } from "@/hooks/useRedux";

export default function SignInForm() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const form = new FormData(e.currentTarget);
        const email = form.get("email") as string;
        const password = form.get("password") as string;

        try {
            // 1. Sign In Call
            const { isSignedIn, nextStep } = await signIn({ username: email, password });

            // 2. Check if login is fully complete
            if (nextStep.signInStep === "DONE") {

                // 3. Fetch User Data immediately (Role janne ke liye)
                const { userId } = await getCurrentUser();
                const attributes = await fetchUserAttributes();
                const role = attributes["custom:role"] as "tenant" | "manager";

                // 4. Update Redux Store IMMEDIATELY (Taaki AuthGuard ko wait na karna pade)
                dispatch(setCredentials({
                    cognitoSub: userId,
                    email: attributes.email || "",
                    name: attributes.name || "",
                    role: role,
                }));

                // 5. PERFECT REDIRECT based on Role
                if (role === "manager") {
                    router.replace("/manager");
                } else {
                    // Tenant goes to home page
                    router.replace("/");
                }
            } else {
                // Agar MFA ya New Password required hai (Not common in simple setup but safe to handle)
                setError("Additional verification required (MFA/New Password).");
            }

        } catch (err) {
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