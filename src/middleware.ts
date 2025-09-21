import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BACKEND_SERVICE_URL } from "../config";

const protectedRoutes = ["/dashboard", "/admin"];

export async function middleware(req: NextRequest) {
    const { pathname, searchParams } = req.nextUrl;
    const token = req.cookies.get("token")?.value;

    // 1. Ignore Next.js internals and RSC fetches
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        searchParams.has("_rsc") // ⬅️ IMPORTANT
    ) {
        return NextResponse.next();
    }

    // 2. Only redirect "/" → "/dashboard" on a *real page load*, not internal fetches
    if (pathname === "/" && token) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // 3. Protect dashboard/admin
    if (protectedRoutes.some((p) => pathname.startsWith(p))) {
        if (!token) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        try {
            const res = await fetch(`${BACKEND_SERVICE_URL}/auth/admin`, {
                headers: { cookie: `token=${token}` },
                cache: "no-store",
            });

            if (!res.ok) {
                return NextResponse.redirect(new URL("/", req.url));
            }
        } catch {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next();
}

// Only run middleware for "real" app routes
export const config = {
    matcher: ["/((?!_next|.*\\..*|api).*)"],
};
