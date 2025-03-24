import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { AuthDatabaseService } from '$lib/db/database';

export const GET: RequestHandler = async ({ cookies }) => {
	AuthDatabaseService.removeCookie(cookies.get('sessionID') || '');
	cookies.delete('sessionID', { path: '/' });
	redirect(302, '/');
};
