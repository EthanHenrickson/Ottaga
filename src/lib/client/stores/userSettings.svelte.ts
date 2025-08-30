import { UserSettingsDTO } from '$lib/client/DTOs/UserSettings';

let userSettings: UserSettingsDTO = $state(new UserSettingsDTO());

export function getUserSettings(): UserSettingsDTO {
	return userSettings;
}

export function setUserSettings(newSettings: UserSettingsDTO) {
	userSettings = newSettings;
}
