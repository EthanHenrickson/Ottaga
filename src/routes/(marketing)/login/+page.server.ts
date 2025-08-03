/** @type {import('./$types').Actions} */
import { fail, redirect } from '@sveltejs/kit';
import argon2 from 'argon2';

import type { Actions } from './$types';
import Analytics from '$lib/utility/analytics/ServerAnalytics';
import { AuthRateLimiterSingleton } from '$lib/utility/security/rateLimiter';
import { UserServiceSingleton } from '$lib/server/Services/Implementations/UserService';
import { CookieServiceSingleton } from '$lib/server/Services/Implementations/CookieService';
import { CreateUserDTO } from '$lib/server/Services/DTOs/User';

const extractFormData = (data: FormData) => {
	return {
		email: data.get('email')?.toString().toLowerCase() as string,
		password: data.get('password') as string,
		name: data.get('name') as string
	};
};

export const actions = {
	/**
	 * Handles user login attempts
	 *
	 * Process:
	 * 1. Extracts credentials from form data
	 * 2. Validates against database records
	 * 3. Creates session cookie on success
	 * 4. Returns error on failure
	 */

	login: async ({ cookies, request }) => {
		const { email, password } = extractFormData(await request.formData());
		const isAllowed = AuthRateLimiterSingleton.isAllowed(email);

		if (!isAllowed) {
			return fail(422, {
				error: 'Too many incorrect attempts, try again later.'
			});
		}

		const user = await UserServiceSingleton.GetByEmail(email);

		if (user.success && user.data) {
			const dbResponse = await argon2.verify(user.data?.hashedPassword, password);
			if (!dbResponse) {
				return fail(422, {
					error: 'Incorrect username or password'
				});
			}
			const cookieResponse = await CookieServiceSingleton.CreateCookie(user.data.id);

			if (cookieResponse.success && cookieResponse.data) {
				cookies.set('sessionID', cookieResponse.data.cookieID, { path: '/' });
				redirect(302, '/dashboard');
			} else {
				Analytics.captureException('Failed to create cookie in database');
				throw Error("Couldn't create cookie");
			}
		}

		return fail(422, {
			error: 'Incorrect username or password'
		});
	},

	/**
	 * Handles new user registration
	 *
	 * Process:
	 * 1. Extracts user information from form data
	 * 2. Securely hashes password using Argon2
	 * 3. Creates new user record in database
	 * 4. Returns error if email already exists
	 */
	signup: async ({ request }) => {
		const { email, password, name } = extractFormData(await request.formData());

		const userDTO = new CreateUserDTO(name, email, password);

		const result = await UserServiceSingleton.Create(userDTO);

		if (!result.success) {
			return fail(422, {
				error: result.message
			});
		}
	}
} satisfies Actions;
