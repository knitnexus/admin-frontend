// app/dashboard/layout.tsx
import Sidebar from "@/components/Sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <main className="flex-1 md:ml-0 bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="p-6 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}