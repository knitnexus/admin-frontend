"use client"
import DashboardCard from "@/components/Dashboard/DashboardCard"
import { Building2,Megaphone } from "lucide-react"
export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Welcome to your admin dashboard</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard
                    title="Onboard Company"
                    description="Add new companies to the platform"
                    icon={Building2}
                    href="/dashboard/onboard-company"
                />
                <DashboardCard
                    title="Create Job Post"
                    description="send a post requirement "
                    icon={Megaphone}
                    href="/dashboard/jobpost"
                />
            </div>
        </div>
    )
}