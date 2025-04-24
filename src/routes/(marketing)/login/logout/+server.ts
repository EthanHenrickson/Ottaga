import { redirect } from '@sveltejs/kit';
import { AuthDatabase } from '$lib/db/auth';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	const cookieID = cookies.get('sessionID') || ''

	await AuthDatabase.removeCookie(cookieID);
	
	cookies.delete('sessionID', { path: '/' });
	redirect(302, '/');
};
