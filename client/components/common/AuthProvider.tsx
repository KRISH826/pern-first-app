"use client"

import { useAppDispatch } from '@/hooks/useRedux'
import { logout, setCredentials } from '@/store/user/userSlice';
import { fetchAuthSession, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import React, { useEffect } from 'react'

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        const syncAuth = async () => {
            try {
                await fetchAuthSession();
                const { userId } = await getCurrentUser();
                const attributes = await fetchUserAttributes();
                dispatch(setCredentials({
                    cognitoSub: userId,
                    email: attributes.email as string,
                    name: attributes.name as string,
                    role: attributes["custom:role"] as "tenant" | "manager"
                }))
            } catch (error) {
                console.log(error);
                dispatch(logout());
            }
        }
        syncAuth();
    }, [dispatch])
    return (
        <>{children}</>
    )
}

export default AuthProvider
