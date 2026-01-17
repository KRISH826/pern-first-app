"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import { Suspense } from "react";
import "../utils/amplify";

import Loading from "@/components/common/Loading";
import { StoreProvider } from "@/store/provider";
import AuthBootstrap from "@/components/common/AuthBootstrap";

const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <StoreProvider>
            <Authenticator.Provider>
                <AuthBootstrap>
                    <Suspense fallback={<Loading />}>{children}</Suspense>
                </AuthBootstrap>
            </Authenticator.Provider>
        </StoreProvider>
    );
};

export default Provider;
