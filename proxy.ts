import { isEmailAdmin } from "@/lib/auth";
import { clerkClient, clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAccountRoute = (pathname: string) =>
  pathname === "/account" || pathname.startsWith("/account/");

const isAdminRoute = (pathname: string) =>
  pathname === "/admin" || pathname.startsWith("/admin/");

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  if (!isAccountRoute(pathname) && !isAdminRoute(pathname)) {
    return NextResponse.next();
  }

  const { userId } = await auth.protect({
    unauthenticatedUrl: "/sign-in",
  });

  if (!isAdminRoute(pathname)) {
    return NextResponse.next();
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const email = user.primaryEmailAddress?.emailAddress;

  if (!isEmailAdmin(email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
