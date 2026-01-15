import React, { Suspense } from 'react'
import ForgetPasswordForm from './_components/ForgetPasswordForm'
import Loading from '@/components/common/Loading'

const page = () => {
    return (
        <Suspense fallback={<Loading />}>
            <ForgetPasswordForm />
        </Suspense>
    )
}

export default page