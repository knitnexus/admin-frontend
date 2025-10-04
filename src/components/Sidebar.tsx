// components/Sidebar.tsx
"use client"
import Image from "next/image";
import logo from '../../public/logo.svg';
import { useState} from "react"
import Link from "next/link"
import { Menu, X, Home, Building, Users, ChevronRight } from "lucide-react"
import {useAuthStore} from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

// Navigation items array - easily configurable
const sidebarItems = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: Home
    },
    {
        name: "Companies",
        href: "/dashboard/companies",
        icon: Building
    },
    {
        name: "Users",
        href: "/dashboard/users",
        icon: Users
    },
]

export default function Sidebar() {
    const {  logout } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);



    // This prevents the component from interfering with navigation

    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    const closeSidebar = () => {
        setIsOpen(false)
    }

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            // Only redirect after successful logout
            router.push("/");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoading(false);
        }
    }

    // Don't render sidebar if user is not authenticated
    // Let middleware handle the redirect
    // if (!user) {
    //     return null;
    // }

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 text-white px-4 py-3 shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <h1 className="text-lg font-semibold">Admin Panel</h1>
                </div>
                <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-screen w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white z-50 transform transition-all duration-300 ease-out shadow-2xl flex flex-col
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center gap-3 p-6 border-b border-slate-700/50">
                    <div className="flex gap-2 flex-col">
                        <Image src={logo} alt="Logo" />
                        <p className="text-slate-400 text-sm">Management Console</p>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 overflow-y-auto py-6">
                    <ul className="space-y-2 px-4">
                        {sidebarItems.map((item) => {
                            const IconComponent = item.icon
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        onClick={closeSidebar}
                                        className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 hover:translate-x-1 active:scale-95"
                                    >
                                        <IconComponent className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors duration-200" />
                                        <span className="font-medium group-hover:text-white transition-colors duration-200">
                                            {item.name}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-200" />
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                {/* Logout Button - Pushed to bottom */}
                <div className="mt-auto">
                    <div className="w-full px-4 pb-4">
                        <button
                            onClick={handleLogout}
                            disabled={loading}
                            className="cursor-pointer rounded-lg w-full bg-red-600 p-3 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? "Logging out..." : "Logout"}
                        </button>
                    </div>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-slate-700/50">
                        <div className="text-xs text-slate-500 text-center">
                            © 2024 Admin Panel
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-40 transition-opacity duration-300"
                    onClick={closeSidebar}
                    aria-label="Close sidebar"
                />
            )}

            {/* Mobile content spacer */}
            <div className="md:hidden h-16" />
        </>
    )
}