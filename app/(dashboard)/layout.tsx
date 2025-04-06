import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full relative">
            {/* Sidebar desktop */}
            <div className="hidden lg:flex h-full w-64 flex-col fixed inset-y-0 z-50 bg-sidebar border-r border-border">
                <AppSidebar variant="desktop" />
            </div>
            <div className="lg:pl-64 h-full">
                {/* Versión móvil del sidebar */}
                <AppSidebar />
                <main className="h-full pt-2 px-4 overflow-y-auto bg-slate-100 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:20px_20px]">
                    <div className="pb-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}