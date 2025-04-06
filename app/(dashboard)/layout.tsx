import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full relative">
            <div className="hidden lg:flex h-full w-64 flex-col fixed inset-y-0 z-50">
                <AppSidebar />
            </div>
            <div className="lg:pl-64 h-full">
                <main className="h-full pt-2 px-4 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}