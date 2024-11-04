import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	const cookieName =
		process.env.SECURE === "false"
			? "next-auth.session-token"
			: "__Secure-next-auth.session-token";
	const isLoggedIn = request.cookies.get(cookieName);
	if (isLoggedIn || request.nextUrl.pathname === "/") {
		return NextResponse.next();
	}
	const base = `${process.env.NEXT_PUBLIC_BASE_URL}`;
	const redirect = new URLSearchParams({
		callbackUrl: `${base}/dashboard`,
	});
	return NextResponse.redirect(`${base}/signin?${redirect.toString()}`);
}

export const config = {
	matcher: {
		source: "/((?!api|_next/static|_next/image|favicon.ico|signin).*)",
	},
};
