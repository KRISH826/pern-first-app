import GuestGuard from "@/components/common/GuestGuard";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <GuestGuard>
            {children}
        </GuestGuard>
    );
}
