import React, { Suspense } from 'react'
import ForgetPasswordForm from './_components/ForgetPasswordForm'

const page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ForgetPasswordForm />
        </Suspense>
    )
}

export default page