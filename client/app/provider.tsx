"use client"
import { Authenticator } from '@aws-amplify/ui-react'
import React, { Suspense } from 'react'
import '../utils/amplify'
import Loading from '@/components/common/Loading'
import { StoreProvider } from '@/store/provider'


const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <StoreProvider>
            <Authenticator.Provider>
                <Suspense fallback={<Loading />}>
                    {children}
                </Suspense>
            </Authenticator.Provider>
        </StoreProvider>
    )
}

export default Provider