import { Suspense } from "react";
import VerifyEmailPage from "./_components/VerifyEmail";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailPage />
        </Suspense>
    );
}