import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CookieServiceSingleton } from '$lib/server/Services/CookieService';
import PostHogAnalytics from '$lib/server/utility/analytics/ServerAnalytics';

export const GET: RequestHandler = async ({ cookies, locals }) => {
	const cookieID = cookies.get('sessionID');

	if (cookieID) {
		await CookieServiceSingleton.DeleteCookieByID(cookieID);

		PostHogAnalytics.capture({
			distinctId: locals.user?.id || 'anonymous',
			event: 'logout_success'
		});
	}

	cookies.delete('sessionID', { path: '/' });
	redirect(302, '/');
};
