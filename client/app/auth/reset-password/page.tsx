import React, { Suspense } from 'react'
import ResetPasswordForm from './_components/ResetPasswordForm'

const ResetPassWordPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    )
}

export default ResetPassWordPage