"use client"

import { useAppSelector } from '@/hooks/useRedux'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

type Props = {
    children: React.ReactNode
}

/**
 * GuestGuard - Protects auth pages from authenticated users
 * Redirects logged-in users to their role-based dashboard
 */
const GuestGuard = ({ children }: Props) => {
    const { isAuthenticated, user, isInitialized } = useAppSelector(state => state.auth);
    const router = useRouter()

    useEffect(() => {
        // Only redirect after auth state is initialized and user is authenticated
        if (isInitialized && isAuthenticated && user) {
            // Redirect based on role
            if (user.role === "manager") {
                router.replace("/manager");
            } else {
                // Tenant goes to home page
                router.replace("/");
            }
        }
    }, [isInitialized, isAuthenticated, user, router])

    // Show nothing while checking auth or if authenticated (will redirect)
    if (!isInitialized || isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Only render children if not authenticated
    return (
        <>{children}</>
    )
}

export default GuestGuard
