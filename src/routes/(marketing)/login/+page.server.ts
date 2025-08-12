/** @type {import('./$types').Actions} */
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import Analytics from '$lib/utility/server/analytics/ServerAnalytics';
import { AuthRateLimiterSingleton } from '$lib/utility/server/security/RateLimiter';
import { CookieServiceSingleton } from '$lib/server/Services/CookieService';
import { AuthServiceSingleton } from '$lib/server/Services/AuthService';

const extractFormData = (data: FormData) => {
	return {
		email: data.get('email')?.toString().toLowerCase() as string,
		password: data.get('password') as string,
		name: data.get('name') as string
	};
};

export const actions = {
	login: async ({ cookies, request }) => {
		const { email, password } = extractFormData(await request.formData());

		if (!AuthRateLimiterSingleton.isAllowed(email)) {
			return fail(422, {
				error: 'Too many incorrect attempts, try again later.'
			});
		}

		const AuthServiceResponse = await AuthServiceSingleton.VerifyAccount(email, password);
		if (!AuthServiceResponse || !AuthServiceResponse.data) {
			return fail(422, {
				error: 'Incorrect email or password'
			});
		}

		const cookieResponse = await CookieServiceSingleton.CreateCookie(AuthServiceResponse.data);
		if (!cookieResponse.success || !cookieResponse.data) {
			Analytics.captureException('Failed to create cookie in database');
			throw Error("Couldn't create cookie");
		}

		cookies.set('sessionID', cookieResponse.data.cookieID, { path: '/' });
		redirect(302, '/dashboard');
	},

	signup: async ({ request }) => {
		const { email, password, name } = extractFormData(await request.formData());

		const AuthResponse = await AuthServiceSingleton.CreateAccount(email, password, name);
		if (!AuthResponse.success) {
			return fail(422, {
				error: AuthResponse.message
			});
		}
	}
} satisfies Actions;
