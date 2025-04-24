
import { AuthDatabase } from '$lib/db/auth';
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

    // Retrieve the session cookie from the browser
    const cookieID = event.cookies.get('sessionID');

    if (!cookieID) {
        // No session cookie found - redirect to login
        redirect(302, '/login');
    }

    // Fetch the cookie details from the authentication database
    const databaseCookie = await AuthDatabase.getCookie(cookieID);
    if (!databaseCookie.success) {
        // Cookie not found in the database - redirect to login
        redirect(302, '/login');
    }

    // Check if the session cookie is still valid based on expiration time
    const cookieValid = databaseCookie.data.expireTime > Date.now();
    if (cookieValid) {
        // Session is valid - refresh the cookie to extend its lifetime
        await AuthDatabase.updateCookie(databaseCookie.data.id);

        // Attach user information to the request locals for downstream use
        event.locals.user = {
            id: databaseCookie.data.userID
        };

        // Continue with the request processing
        return resolve(event);
    } else {
        // Session has expired - remove the invalid cookie
        await AuthDatabase.removeCookie(databaseCookie.data.id);

        // Redirect to login for expired sessions
        redirect(302, '/login');
    }
};
