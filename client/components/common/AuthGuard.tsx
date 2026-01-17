"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/hooks/useRedux";

type Role = "tenant" | "manager";

interface AuthGuardProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
    mode?: "protected" | "guest";
}

const AuthGuard = ({
    children,
    allowedRoles,
    mode = "protected",
}: AuthGuardProps) => {
    const { isAuthenticated, user, isInitialized } = useAppSelector(
        (state) => state.auth
    );

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isInitialized) return;

        // 🔐 PROTECTED ROUTES
        if (mode === "protected") {
            if (!isAuthenticated) {
                router.replace(`/auth/sign-in?callbackUrl=${pathname}`);
                return;
            }

            if (allowedRoles && user && !allowedRoles.includes(user.role)) {
                router.replace("/403");
            }
        }

        // 🌍 GUEST ROUTES (login, signup)
        if (mode === "guest") {
            if (isAuthenticated && user) {
                router.replace(user.role === "manager" ? "/manager" : "/");
            }
        }
    }, [isInitialized, isAuthenticated, user, router, pathname, mode, allowedRoles]);

    // ⏳ Global loading state
    if (!isInitialized) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    // 🚫 Block rendering until redirect finishes
    if (mode === "protected" && !isAuthenticated) return null;
    if (mode === "guest" && isAuthenticated) return null;

    return <>{children}</>;
};

export default AuthGuard;
