import React, { Suspense } from 'react'
import ResetPasswordForm from './_components/ResetPasswordForm'
import Loading from '@/components/common/Loading'

const ResetPassWordPage = () => {
    return (
        <Suspense fallback={<Loading />}>
            <ResetPasswordForm />
        </Suspense>
    )
}

export default ResetPassWordPage