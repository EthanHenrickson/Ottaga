import { redirect } from '@sveltejs/kit';

import type { RequestHandler } from './$types';
import { CookieServiceSingleton } from '$lib/server/Services/Implementations/CookieService';

export const GET: RequestHandler = async ({ cookies }) => {
	const cookieID = cookies.get('sessionID') || ''

	await CookieServiceSingleton.DeleteCookieByID(cookieID);

	cookies.delete('sessionID', { path: '/' });
	redirect(302, '/');
};
