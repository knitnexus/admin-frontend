"use client"
import Image from "next/image";
import logo from '../../public/logo.svg';
import {useAuthStore} from "@/store/useAuthStore";
import {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
export default function Home() {

const {login, loading , error , user,fetchUser }= useAuthStore();

    interface CompanyForm {
        email: string;
        password: string;
        // add all fields your form collects
    }

    const [form, setForm] = useState<CompanyForm>({
        email: "",
        password: "",
    });

    const router = useRouter();
const pathname=usePathname()
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // Redirect if logged in
    useEffect(() => {
        if (user && pathname === "/") {
            router.push("/dashboard");
        }
    }, [user, pathname,router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(prev => ({ ...prev, [e.target.id]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(form.email, form.password);
    };

  return  (
        <div className="flex text-black min-h-screen flex-col md:flex-row">
            {/* Left Section */}
            <div className="flex flex-1 flex-col justify-center bg-gray-50 p-8">
                <div className="mb-8">
                   <Image  alt={"logo"} src={logo}></Image>
                </div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Login into the  App
                </h1>
                <p className="mt-2 text-gray-500">
                    Admin access only. Please sign in to continue.
                </p>
            </div>

            {/* Right Section */}
            <div className="flex flex-1 items-center justify-center bg-white p-8 shadow-md">
                <div className="w-full max-w-sm">
                    <h2 className="mb-6 text-xl font-semibold text-gray-700">
                        Admin Login
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-600"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                onChange={handleChange}
                                required
                                disabled={loading}
                                value={form.email}
                                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label

                                htmlFor="password"
                                className="block text-sm font-medium text-gray-600"
                            >
                                Password
                            </label>
                            <input
                                onChange={handleChange}
                                value={form.password}
                                type="password"
                                disabled={loading}
                                required
                                id="password"
                                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
                                placeholder="••••••••"
                            />
                        </div>
                        {/* Show error */}
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                        {loading && <p className="text-gray-500 mt-2">Please wait...</p>}

                        <button
                            disabled={loading}

                            type="submit"
                            className="w-full rounded-lg bg-indigo-600 p-2 text-white hover:bg-indigo-700"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
