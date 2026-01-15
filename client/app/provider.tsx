"use client"
import { ReduxProvider } from '@/store/provider'
import { Authenticator } from '@aws-amplify/ui-react'
import React, { Suspense } from 'react'
import '../utils/amplify'


const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ReduxProvider>
            <Authenticator.Provider>
                <Suspense fallback={<div>Loading...</div>}>
                    {children}
                </Suspense>
            </Authenticator.Provider>
        </ReduxProvider>
    )
}

export default Provider