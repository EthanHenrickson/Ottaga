import { CookieServiceSingleton } from '$lib/server/Services/CookieService';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const ProtectedRoutes = ['/api', '/dashboard'];
	let isProtectedRoute = ProtectedRoutes.some((route) => event.url.pathname.startsWith(route));

	let isAuthRoute =
		event.url.pathname.startsWith('/api/auth') || event.url.pathname.startsWith('/api/llm');

	if (!isProtectedRoute || isAuthRoute) {
		return resolve(event);
	}

	const cookieID = event.cookies.get('sessionID');
	if (!cookieID) {
		redirect(303, '/login');
	}

	// Fetch the cookie from database
	const databaseCookie = await CookieServiceSingleton.GetCookieByID(cookieID);
	if (!databaseCookie.success || !databaseCookie.data) {
		redirect(303, '/login');
	}

	const ExpireTime = databaseCookie.data.expireTime.getTime();

	const cookieValid = ExpireTime > Date.now();
	if (cookieValid) {
		// Only update cookie expire time if its less than 5 minutes to expire
		if (ExpireTime - Date.now() < 5 * 1000 * 60) {
			await CookieServiceSingleton.UpdateCookieByID(databaseCookie.data.cookieID);
		}

		event.locals.user = {
			id: databaseCookie.data.FK_userID
		};

		return resolve(event);
	} else {
		await CookieServiceSingleton.DeleteCookieByID(databaseCookie.data.cookieID);

		redirect(302, '/login');
	}
};
