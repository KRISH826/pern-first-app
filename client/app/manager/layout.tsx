import AuthGuard from "@/components/common/AuthGuard";


export default function ManagerLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard allowedRoles={["manager"]}>
            <main>{children}</main>
        </AuthGuard>
    );
}