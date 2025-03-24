import { redirect } from '@sveltejs/kit';
import { AuthDatabase } from '$lib/db/auth';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	AuthDatabase.removeCookie(cookies.get('sessionID') || '');
	cookies.delete('sessionID', { path: '/' });
	redirect(302, '/');
};
