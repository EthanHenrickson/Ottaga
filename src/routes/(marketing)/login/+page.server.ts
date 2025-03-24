/** @type {import('./$types').Actions} */

/**
 * Server-side authentication handlers for login and signup functionality
 * 
 * This module provides form actions for:
 * 1. User Login: Validates credentials and creates session cookies
 * 2. User Signup: Creates new user accounts with secure password hashing
 * 
 * Security features:
 * - Password hashing using Argon2
 * - Secure random string generation for session IDs
 * - Case-insensitive email handling
 * - Cookie-based session management
 */

import { AuthDatabaseService } from '$lib/db/database';
import { generateRandomString } from '@oslojs/crypto/random';
import argon2 from 'argon2';
import type { BaseUserRecord } from '$lib/types';
import type { Actions } from './$types';

import type { RandomReader } from '@oslojs/crypto/random';
import { fail, redirect } from '@sveltejs/kit';

// Configure secure random number generation for session IDs
const random: RandomReader = {
	read(bytes: Uint8Array): void {
		crypto.getRandomValues(bytes);
	}
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
		const data = await request.formData();
		const email = (<string>data.get('email')).toLowerCase();
		const password = <string>data.get('password');

		const user = AuthDatabaseService.getUserByEmail(email);

		if (user.success) {
			if (await argon2.verify(user.data.hashedPassword, password)) {
				const cookieID = generateRandomString(random, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 20);
				AuthDatabaseService.createCookie(cookieID, user.data.id);
				cookies.set('sessionID', cookieID, { path: '/' });
				redirect(302, '/home');
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
		const email = <string>data.get('email');
		const password = <string>data.get('password');
		const passwordHash = await argon2.hash(password, { timeCost: 2 });
		const firstName = <string>data.get('firstName');
		const lastName = <string>data.get('lastName');

		const newUserData: BaseUserRecord = {
			firstName: firstName,
			lastName: lastName,
			email: email.toLowerCase(),
			hashedPassword: passwordHash
		};

		const result = AuthDatabaseService.createUser(newUserData);

		if (!result.success) {
			return fail(422, {
				error: result.message
			});
		}
	}
} satisfies Actions;
