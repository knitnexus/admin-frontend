import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const   BACKEND_SERVICE_URL=process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL;

const protectedRoutes = ["/dashboard", "/admin"];

export async function middleware(req: NextRequest) {
    const { pathname, searchParams } = req.nextUrl;
    const token = req.cookies.get("token")?.value;
    console.log(`Middleware: ${pathname}, Token: ${!!token}, RSC: ${searchParams.has("_rsc")}`);
    // 1. Ignore Next.js internals and RSC fetches
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        searchParams.has("_rsc") ||
        req.headers.get("rsc") === "1"
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
                credentials: "include",
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
