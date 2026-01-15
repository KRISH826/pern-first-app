"use client"
import { ReduxProvider } from '@/store/provider'
import { Authenticator } from '@aws-amplify/ui-react'
import React, { Suspense } from 'react'
import '../utils/amplify'
import Loading from '@/components/common/Loading'


const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ReduxProvider>
            <Authenticator.Provider>
                <Suspense fallback={<Loading />}>
                    {children}
                </Suspense>
            </Authenticator.Provider>
        </ReduxProvider>
    )
}

export default Provider