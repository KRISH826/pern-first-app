"use client"

import { useAppSelector } from '@/hooks/useRedux'
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

type props = {
    children: React.ReactNode,
    allowedRoles?: ("tenant" | "manager")[]
}

const AuthGuard = ({ children, allowedRoles }: props) => {
    const { isAuthenticated, user, isInitialized, isLoading } = useAppSelector(state => state.auth);
    const pathname = usePathname();
    const router = useRouter()

    useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            router.replace(`/auth/sign-in?callbackUrl=${pathname}`);
        }
    }, [isInitialized, isAuthenticated, pathname, router])

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
    return (
        <>{children}</>
    )
}

export default AuthGuard