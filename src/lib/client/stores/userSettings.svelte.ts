import { CreateUserSettingsDTO, UserSettingsDTO } from '$lib/client/DTOs/UserSettings';

let userSettings: UserSettingsDTO = $state(new CreateUserSettingsDTO());

export function getUserSettings(): UserSettingsDTO {
	return userSettings;
}

export function setUserSettings(newSettings: UserSettingsDTO) {
	userSettings = newSettings;
}
