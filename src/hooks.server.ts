
import { CookieServiceSingleton } from '$lib/server/Services/Implementations/CookieService';
import { redirect, type Handle } from '@sveltejs/kit';

/**
 * Server-side authentication hook for handling route access and session management.
 *
 * This hook intercepts server-side route requests and performs the following key functions:
 * - Allows unrestricted access to authentication routes and non-home routes
 * - Validates user sessions using browser cookies
 * - Redirects unauthenticated or expired sessions to the login page
 * - Refreshes valid session cookies to extend their lifetime
 *
 */
export const handle: Handle = async ({ event, resolve }) => {

    const ProtectedRoutes = ['/api', '/dashboard']
    let isProtectedRoute = ProtectedRoutes.some(route => event.url.pathname.startsWith(route))

    let isAuthRoute = event.url.pathname.startsWith('/api/auth') || event.url.pathname.startsWith('/api/llm');
    //Allow non protected routes and auth/llm api to be accessed by everyone
    if (!isProtectedRoute || isAuthRoute) {
        return resolve(event);
    }

    const cookieID = event.cookies.get('sessionID');
    if (!cookieID) {
        // No session cookie found - redirect to login
        redirect(303, '/login');
    }

    // Fetch the cookie details from the authentication database
    const databaseCookie = await CookieServiceSingleton.GetCookieByID(cookieID);
    if (!databaseCookie.success || !databaseCookie.data) {
        redirect(303, '/login');
    }

    // Check if the session cookie is still valid based on expiration time
    const cookieValid = databaseCookie.data.expireTime.getTime() > Date.now();
    if (cookieValid) {
        // Session is valid - refresh the cookie to extend its lifetime
        await CookieServiceSingleton.UpdateCookieByID(databaseCookie.data.cookieID);

        // Attach user information to the request locals for downstream use
        event.locals.user = {
            id: databaseCookie.data.cookieID
        };

        // Continue with the request processing
        return resolve(event);
    } else {
        // Session has expired - remove the invalid cookie
        await CookieServiceSingleton.DeleteCookieByID(databaseCookie.data.cookieID);

        // Redirect to login for expired sessions
        redirect(302, '/login');
    }
};
