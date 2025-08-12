import { UserSettingsServiceSingleton } from '$lib/server/Services/UserSettingsService.js';
import { fail } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { CreateUserSettingsDTO } from '$lib/client/DTOs/UserSettings';

export const load: LayoutServerLoad = async ({ locals }) => {
	const userID = locals.user.id;
	const preferences = await UserSettingsServiceSingleton.GetByUserID(userID);

	if (!preferences.data || !preferences.success) {
		const CreateUserSettingsDTOValue = new CreateUserSettingsDTO();
		await UserSettingsServiceSingleton.Create(userID, CreateUserSettingsDTOValue);

		const ServiceResponse = await UserSettingsServiceSingleton.GetByUserID(userID);
		if (!ServiceResponse.success || !ServiceResponse.data) {
			fail(422, 'Sorry we are currently having issues');
		}

		preferences.data = ServiceResponse.data;
	}

	const returnData = JSON.stringify(preferences.data);

	return {
		preferences: returnData
	};
};
