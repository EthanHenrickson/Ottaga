import { redirect } from '@sveltejs/kit';
import { CookieDatabase } from '$lib/db/cookie/cookie';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	const cookieID = cookies.get('sessionID') || ''

	await CookieDatabase.deleteByID(cookieID);

	cookies.delete('sessionID', { path: '/' });
	redirect(302, '/');
};
