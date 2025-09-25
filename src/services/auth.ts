
const   BACKEND_SERVICE_URL=process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL;


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
        headers: { "Content-Type": "application/json" },
        method: "POST",
        credentials: "include",
    });
}

export async function getMe() {
    const res = await fetch(`${BACKEND_SERVICE_URL}/auth/admin`, {
        headers: { "Content-Type": "application/json" },
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) throw new Error("Not authenticated");
    return res.json();
}
