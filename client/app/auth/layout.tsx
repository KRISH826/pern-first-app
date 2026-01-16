import AuthGuard from "@/components/common/AuthGuard";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard mode="guest">
            {children}
        </AuthGuard>
    );
}
