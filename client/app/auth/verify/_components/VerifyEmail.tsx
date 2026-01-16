"use client";

import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSignupManagerMutation, useSignupTenantMutation } from "@/lib/publicApiSlice";

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
    const name = searchParams.get("name") || "";
    const role = searchParams.get("role") || "";
    const userId = searchParams.get("userId") || "";
    const [signupTenant] = useSignupTenantMutation();
    const [signupManager] = useSignupManagerMutation();
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleVerify(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await confirmSignUp({
                username: email,
                confirmationCode: code,
            });

            const userData = {
                cognito_sub: userId,
                name,
                email,
            };

            if (role === "tenant") {
                await signupTenant(userData).unwrap();
            } else {
                await signupManager(userData).unwrap();
            }

            router.push("/auth/sign-in");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Invalid verification code");
        } finally {
            setLoading(false);
        }
    }

    async function resendCode() {
        try {
            await resendSignUpCode({ username: email });
            alert("Code resent successfully!");
        } catch (err) {
            console.error("Failed to resend code:", err);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 px-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Verify your email</CardTitle>
                    <CardDescription>
                        Enter the 6-digit code sent to<br />
                        <span className="font-medium text-foreground">{email}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleVerify} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="code" className="text-sm font-medium">
                                Verification code
                            </label>
                            <Input
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="123456"
                                required
                                className="text-center text-lg tracking-widest"
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Verifying..." : "Verify Email"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <Button variant="link" onClick={resendCode}>
                        Resend code
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}