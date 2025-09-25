// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/admin"];

export function middleware(req: NextRequest) {
    const { pathname, searchParams } = req.nextUrl;

    const isRSC = searchParams.has("_rsc") || req.headers.get("rsc") === "1";
    const isNavigate = req.headers.get("sec-fetch-mode") === "navigate";

    // Skip Next internals, API, RSC fetches, and non-navigation requests
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        isRSC ||
        !isNavigate
    ) {
        return NextResponse.next();
    }

    const token = req.cookies.get("token")?.value;

    // If already authenticated and visiting "/", send to dashboard
    if (pathname === "/" && token) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Protect routes
    if (protectedRoutes.some((p) => pathname.startsWith(p))) {
        if (!token) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|.*\\..*|api).*)"],
};
