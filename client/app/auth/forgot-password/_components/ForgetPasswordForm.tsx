"use client";

import React, { useState } from "react";
import { resetPassword } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { mapAuthError } from "@/lib/authError";

const ForgetPasswordForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await resetPassword({
                username: email,
            });
            router.replace(`/auth/reset-password?email=${encodeURIComponent(email)}`);
        } catch (err) {
            setError(mapAuthError(err))
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 px-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Forgot password</CardTitle>
                    <CardDescription>
                        Enter your email to receive a reset code
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email address
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Sending reset code..." : "Send reset code"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <Button
                        variant="link"
                        onClick={() => router.push("/auth/sign-in")}
                    >
                        Back to sign in
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ForgetPasswordForm;