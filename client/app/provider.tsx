"use client"
import { Authenticator } from '@aws-amplify/ui-react'
import React, { Suspense } from 'react'
import '../utils/amplify'
import Loading from '@/components/common/Loading'
import { StoreProvider } from '@/store/provider'
import AuthInitializer from '@/components/common/AuthInitializer'


const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <StoreProvider>
            <Authenticator.Provider>
                <AuthInitializer>
                    <Suspense fallback={<Loading />}>
                        {children}
                    </Suspense>
                </AuthInitializer>
            </Authenticator.Provider>
        </StoreProvider>
    )
}

export default Provider