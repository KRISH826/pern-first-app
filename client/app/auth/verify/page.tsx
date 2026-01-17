import { Suspense } from "react";
import VerifyEmailPage from "./_components/VerifyEmail";
import Loading from "@/components/common/Loading";

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <VerifyEmailPage />
        </Suspense>
    );
}