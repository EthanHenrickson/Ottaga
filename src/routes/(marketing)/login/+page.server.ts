/** @type {import('./$types').Actions} */
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import PostHogAnalytics from '$lib/server/utility/analytics/ServerAnalytics';
import { AuthRateLimiterSingleton } from '$lib/server/utility/security/rateLimiter';
import { CookieServiceSingleton } from '$lib/server/Services/CookieService';
import { AuthServiceSingleton } from '$lib/server/Services/AuthService';
import { CreateUserDTO } from '$lib/client/DTOs/User';

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

		if (!AuthRateLimiterSingleton.tryConsume(email)) {
			return fail(422, {
				error: 'Too many incorrect attempts, try again later.'
			});
		}

		const AuthServiceResponse = await AuthServiceSingleton.VerifyAccount(email, password);
		if (!AuthServiceResponse || !AuthServiceResponse.data) {
			PostHogAnalytics.capture({
				distinctId: 'Anon',
				event: 'login_failed',
				properties: {
					reason: 'invalid_credentials'
				}
			});
			return fail(422, {
				error: 'Incorrect email or password'
			});
		}

		const cookieResponse = await CookieServiceSingleton.CreateCookie(AuthServiceResponse.data);
		if (!cookieResponse.success || !cookieResponse.data) {
			PostHogAnalytics.captureException('Failed to create cookie in database');
			throw Error("Couldn't create cookie");
		}

		PostHogAnalytics.capture({
			distinctId: 'Anon',
			event: 'login_success'
		});

		cookies.set('sessionID', cookieResponse.data.cookieID, {
			path: '/',
			sameSite: 'strict',
			httpOnly: true,
			secure: true
		});
		redirect(302, '/dashboard');
	},

	signup: async ({ request }) => {
		const { email, password, name } = extractFormData(await request.formData());

		const AuthResponse = await AuthServiceSingleton.CreateAccount(
			new CreateUserDTO(email, password, name)
		);
		if (!AuthResponse.success) {
			PostHogAnalytics.capture({
				distinctId: 'Anon',
				event: 'signup_failed'
			});
			return fail(422, {
				error: AuthResponse.message
			});
		}

		PostHogAnalytics.capture({
			distinctId: 'Anon',
			event: 'signup_success'
		});
	}
} satisfies Actions;
