import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full relative">
            {/* Sidebar desktop */}
            <div className="hidden lg:flex h-full w-64 flex-col fixed inset-y-0 z-50 bg-white border-r">
                <AppSidebar variant="desktop" />
            </div>
            <div className="lg:pl-64 h-full">
                {/* Versión móvil del sidebar */}
                <AppSidebar />
                <main className="h-full pt-2 px-3 overflow-y-auto bg-gray-100">
                    {children}
                </main>
            </div>
        </div>
    );
}