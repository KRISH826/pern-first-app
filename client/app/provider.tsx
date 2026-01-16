"use client"
import { Authenticator } from '@aws-amplify/ui-react'
import React, { Suspense } from 'react'
import '../utils/amplify'
import Loading from '@/components/common/Loading'
import { StoreProvider } from '@/store/provider'
import AuthProvider from '@/components/common/AuthProvider'


const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <StoreProvider>
            <Authenticator.Provider>
                <AuthProvider>
                    <Suspense fallback={<Loading />}>
                        {children}
                    </Suspense>
                </AuthProvider>
            </Authenticator.Provider>
        </StoreProvider>
    )
}

export default Provider