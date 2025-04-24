/** @type {import('./$types').Actions} */
import { AuthDatabase } from '$lib/db/auth';
import { UserDatabase } from '$lib/db/user';
import { fail, redirect } from '@sveltejs/kit';
import argon2 from 'argon2';

import type { NewUserRecord } from '$lib/types';
import type { RandomReader } from '@oslojs/crypto/random';
import type { Actions } from './$types';
import { v7 } from 'uuid';
import Analytics from '$lib/utility/ServerAnalytics';

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
		const data = await request.formData();
		const email = (<string>data.get('email')).toLowerCase();
		const password = <string>data.get('password');

		const user = await UserDatabase.getUserByEmail(email);

		if (user.success) {
			if (await argon2.verify(user.data.hashedPassword, password)) {
				const cookieResponse = await AuthDatabase.createCookie(user.data.id);

				if(cookieResponse.success){
					const cookieID = cookieResponse.data
					cookies.set('sessionID', cookieID, { path: '/' });
					redirect(302, '/dashboard');
				} else {
					Analytics.captureException("Failed to create cookie in database")
					throw Error("Couldn't create cookie")
				}
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
		const data = await request.formData();

		const name = <string>data.get('name');
		const email = <string>data.get('email');
		const password = <string>data.get('password');

		const passwordHash = await argon2.hash(password, { timeCost: 2 });
		
		const newUserData: NewUserRecord = {
			name: name,
			email: email.toLowerCase(),
			hashedPassword: passwordHash,
			createdDate: Date.now()
		};

		const result = await UserDatabase.createUser(newUserData);

		if (!result.success) {
			return fail(422, {
				error: result.message
			});
		}
	}
} satisfies Actions;
