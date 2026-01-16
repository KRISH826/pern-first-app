"use client"

import { useAppSelector } from '@/hooks/useRedux'
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

type Props = {
    children: React.ReactNode,
    allowedRoles?: ("tenant" | "manager")[],
    mode?: "protected" | "guest" // Default is "protected"
}

const AuthGuard = ({ children, allowedRoles, mode = "protected" }: Props) => {
    const { isAuthenticated, user, isInitialized } = useAppSelector(state => state.auth);
    const pathname = usePathname();
    const router = useRouter()

    useEffect(() => {
        if (!isInitialized) return;

        if (mode === "protected") {
            // PROTECTED MODE: Redirect to login if NOT authenticated
            if (!isAuthenticated) {
                // Avoid infinite redirect loop
                if (!pathname.includes("/auth/sign-in")) {
                    router.replace(`/auth/sign-in?callbackUrl=${pathname}`);
                }
            }
        } else {
            // GUEST MODE: Redirect to dashboard if IS authenticated
            if (isAuthenticated && user) {
                if (user.role === "manager") {
                    router.replace("/manager");
                } else {
                    router.replace("/");
                }
            }
        }
    }, [isInitialized, isAuthenticated, pathname, router, mode, user])

    // Loading State
    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // GUEST MODE RENDERING
    if (mode === "guest") {
        // If authenticated, we show nothing (effect will redirect)
        // If not authenticated, we render children (login form)
        return !isAuthenticated ? <>{children}</> : null;
    }

    // PROTECTED MODE RENDERING
    if (!isAuthenticated) {
        return null;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-red-500">403</h1>
                    <p className="text-gray-600">You don&apos;t have permission to access this page.</p>
                </div>
            </div>
        );
    }

    return <>{children}</>
}

export default AuthGuard