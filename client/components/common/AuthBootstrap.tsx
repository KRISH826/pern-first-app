"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useRedux";
import { logout, setCredentials } from "@/store/user/userSlice";
import {
    fetchAuthSession,
    getCurrentUser,
    fetchUserAttributes,
} from "aws-amplify/auth";

const AuthBootstrap = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const bootstrapAuth = async () => {
            try {
                // 1️⃣ Check session (refresh if needed)
                const session = await fetchAuthSession();

                if (!session.tokens?.idToken) {
                    throw new Error("No session");
                }

                // 2️⃣ Get user + attributes
                const user = await getCurrentUser();
                const attributes = await fetchUserAttributes();

                dispatch(
                    setCredentials({
                        email: attributes.email as string,
                        name: attributes.name as string,
                        role: attributes["custom:role"] as "tenant" | "manager",
                    })
                );
            } catch (err) {
                console.warn("Auth bootstrap failed:", err);
                dispatch(logout());
            }
        };

        bootstrapAuth();
    }, [dispatch]);

    return <>{children}</>;
};

export default AuthBootstrap;