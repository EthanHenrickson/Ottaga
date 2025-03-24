import { AuthDatabaseService } from '$lib/db/database';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, params }) => {
	const data = await request.json();
	const path = params.endpoint;

	try {
		switch (path) {
			case 'signup': {
				const result = AuthDatabaseService.createUser(data);
				return json(result);
			}

			case 'login': {
				const user = AuthDatabaseService.getUserByEmail(data.email.toLowerCase());
				return json(user);
			}

			default:
				console.error(path, ' is an invalid path');
				return json({ success: false, message: 'Invalid Endpoint' }, { status: 500 });
		}
	} catch (error) {
		console.error(error);
		return json({ success: false, message: 'Server Error' }, { status: 500 });
	}
};
