import { UserSettingsServiceSingleton } from '$lib/server/Services/Implementations/UserSettingsService';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	const userID = locals.user.id;
	const databaseResponse = await UserSettingsServiceSingleton.GetUserSettingsByUserID(userID);

	return json({ success: databaseResponse.success, data: databaseResponse.data });
};

export const POST: RequestHandler = async ({ locals, request }) => {
	const userID = locals.user.id;
	const userSettingsData = await request.json();
	const databaseResponse = await UserSettingsServiceSingleton.UpdateUserSettingsByUserID(
		userID,
		userSettingsData
	);

	return json({ success: databaseResponse.success });
};
