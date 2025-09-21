"use client"

import { LucideIcon } from "lucide-react"
import Link from "next/link"

interface DashboardCardProps {
    title: string
    description: string
    icon: LucideIcon
    href: string
}

export default function DashboardCard({
                                          title,
                                          description,
                                          icon: Icon,
                                          href
                                      }: DashboardCardProps) {
    return (
        <Link className="block h-full" href={href}>
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200 hover:border-blue-300 cursor-pointer">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        {description && (
                            <p className="text-sm text-gray-600 mt-1">{description}</p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}
