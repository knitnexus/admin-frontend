import {BACKEND_SERVICE_URL} from "../../config";

export async function login(email: string, password: string) {
    const res = await fetch(`${BACKEND_SERVICE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // <--- send cookie
    });

    if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Login failed");
    }

    return res.json();
}

export async function logout() {
    await fetch(`${BACKEND_SERVICE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
    });
}

export async function getMe() {
    const res = await fetch(`${BACKEND_SERVICE_URL}/auth/admin`, {
        credentials: "include",
    });

    if (!res.ok) throw new Error("Not authenticated");
    return res.json();
}
