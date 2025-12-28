import type { UserSettings } from '$lib/server/db/databaseTypes';

export class UserSettingsDTO {
	theme: string = 'light';
	receiveCommunityDigest: boolean = true;
	saveConversations: boolean = true;
	simplifiedLanguage: boolean = false;
	reduceMotion: boolean = false;

	constructor(data: UserSettings) {
		this.theme = data.theme;
		this.receiveCommunityDigest = data.receiveCommunityDigest;
		this.saveConversations = data.saveConversations;
		this.simplifiedLanguage = data.simplifiedLanguage;
		this.reduceMotion = data.reduceMotion;
	}
}

export class CreateUserSettingsDTO {
	constructor(
		readonly theme: string = 'light',
		readonly receiveCommunityDigest: boolean = true,
		readonly saveConversations: boolean = true,
		readonly simplifiedLanguage: boolean = false,
		readonly reduceMotion: boolean = false
	) {}
}

export class UpdateUserSettingsDTO {
	constructor(
		readonly theme?: string,
		readonly receiveCommunityDigest?: boolean,
		readonly saveConversations?: boolean,
		readonly simplifiedLanguage?: boolean,
		readonly reduceMotion?: boolean
	) {}
}
