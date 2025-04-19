import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/"]);
const isOnboardingRoute = createRouteMatcher(["/onboarding"]);

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims, redirectToSignIn } = await auth();

    // 1. If the route is "/" (public route)
    if (isPublicRoute(req)) {
        // 🚫 If user is logged in, redirect them away from "/"
        if (userId) {
            return NextResponse.redirect(new URL("/dashboard", req.url)); // or any other page
        }

        // ✅ Allow access to "/" if not logged in
        return NextResponse.next();
    }

    // 2. Allow access to onboarding page if user is logged in
    if (userId && isOnboardingRoute(req)) {
        return NextResponse.next();
    }

    // 3. Redirect unauthenticated users to sign in
    if (!userId) {
        return redirectToSignIn({ returnBackUrl: req.url });
    }

    // 4. Check onboardingComplete from sessionClaims
    const onboardingComplete = sessionClaims?.metadata?.onboardingComplete;

    // 5. Redirect to onboarding if not complete
    if (!onboardingComplete) {
        const onboardingUrl = new URL("/onboarding", req.url);
        return NextResponse.redirect(onboardingUrl);
    }

    // 6. Let them through
    return NextResponse.next();
});

export const config = {
    matcher: [
        "/((?!_next|api|trpc|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    ],
};
