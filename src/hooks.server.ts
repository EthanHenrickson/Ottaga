
import { CookieDatabase } from '$lib/db/cookie';
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
    // Skip authentication for auth routes or non-dashboard routes
    if (event.url.pathname.startsWith('/api/auth') || !event.url.pathname.startsWith('/dashboard')) {
        return resolve(event);
    }

    const cookieID = event.cookies.get('sessionID');
    if (!cookieID) {
        // No session cookie found - redirect to login
        redirect(302, '/login');
    }

    // Fetch the cookie details from the authentication database
    const databaseCookie = await CookieDatabase.getByID(cookieID);
    if (!databaseCookie.success) {
        redirect(302, '/login');
    }

    // Check if the session cookie is still valid based on expiration time
    const cookieValid = databaseCookie.data.cookie.expireTime > Date.now();
    if (cookieValid) {
        // Session is valid - refresh the cookie to extend its lifetime
        await CookieDatabase.updateByID(databaseCookie.data.cookie.id);

        // Attach user information to the request locals for downstream use
        event.locals.user = {
            id: databaseCookie.data.cookie.userID
        };

        // Continue with the request processing
        return resolve(event);
    } else {
        // Session has expired - remove the invalid cookie
        await CookieDatabase.deleteByID(databaseCookie.data.cookie.id);

        // Redirect to login for expired sessions
        redirect(302, '/login');
    }
};
